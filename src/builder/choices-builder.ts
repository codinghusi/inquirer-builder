import inquirer, { Answers } from "inquirer";
import { Answer, Message, PromptType, QuestionBuilder } from "./builder";
import { ChoiceEntryBuilder } from "./choice-entry";
import { Context } from "./prompter";
import { KeyValue } from "./utils";

type Choice = string | ChoiceEntryBuilder | inquirer.ChoiceOptions;

export type Choices = KeyValue<Choice> | Choice[] | ((answers: Answers) => Choice[]);

export type UniformedChoices = Choice[];

const Choice = {
    uniform(choice: Choice) {
        if (typeof(choice) === "string") {
            return new ChoiceEntryBuilder(choice);
        }
        
        if (choice instanceof ChoiceEntryBuilder) {
            return choice
        }

        if (typeof(choice) === "object") {
            return ChoiceEntryBuilder.from(choice);
        }

        throw "given choice in incorrect format";
    }
}

const Choices = {
    uniformWithoutFn(choices: Choices) {
        // Handle the Array
        if (Array.isArray(choices)) {
            return choices.map(Choice.uniform);
        }

        // Handle {[value]: string | ChoiceEntryBuilder}
        if (typeof(choices) === "object") {
            return Object.entries(choices).map(([value, choice]) => {
                choice = Choice.uniform(choice);
                choice.value(value);
                return choice;
            });
        }

        throw "choices have wrong type";
    },
    uniform(choices: Choices, answers: Answers): ChoiceEntryBuilder[] {
        // Handle the function
        if (typeof(choices) === "function") {
            return Choices.uniform(choices(answers), answers);
        }

        // Handle others
        return this.uniformWithoutFn(choices);
    },
    build(choices: Choices, answers: Answers): inquirer.ChoiceOptions[] | (() => inquirer.ChoiceOptions[]) {
        // Handle the function
        if (typeof(choices) === "function") {
            return () => Choices.uniform(choices(answers), answers).map(choice => choice.build());
        }

        // Handle others
        return this.uniformWithoutFn(choices).map((choice: ChoiceEntryBuilder) => choice.build());
    }
}

export abstract class ChoicesBuilder extends QuestionBuilder {
    _choices: Choices;
    _pageSize: number;
    _loop: boolean;

    constructor(type: PromptType, message: Message, choices: Choices) {
        super(type, message);
        this.choices(choices);
    }

    async handleAnswer(answer: string | string[], context: Context) {
        super.handleAnswer(answer, context);
        
        // Get a ChoiceEntryBuilder Array only
        const choices = Choices.uniform(this._choices, context.local);

        // Compability for Checkboxes and Lists
        if (!Array.isArray(answer)) {
            answer = [answer];
        }

        const entryBuilders = choices.filter(choice => choice instanceof ChoiceEntryBuilder)
        const selected = answer.map(selected => entryBuilders.find(choice => choice.build().value === selected))
                               .filter(selected => !!selected);
        for (const entry of selected) {
            await entry.runNested(context);
        }
    }

    choices(choices: Choices) {
        this._choices = choices;
        return this;
    }

    pageSize(pageSize: number) {
        this._pageSize = pageSize;
        return this;
    }

    loop(loop: boolean) {
        this._loop = loop;
        return this;
    }

    add(choice: Choice) {
        if (!this._choices) {
            this.choices([]);
        } else if (typeof(this._choices) === "function") {
            throw "cannot add a choice to a function generating a choice array later";
        }
        (this._choices as Choice[]).push(choice);
    }

    build(answers: Answers) {
        return { 
            ...super.build(answers),
            choices: Choices.build(this._choices, answers),
            pageSize: this._pageSize,
            loop: this._loop
        };
    }
}