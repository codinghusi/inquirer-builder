import { Answers } from "inquirer";
import { QuestionBuilder } from "../builders/builder";
import { Context } from "../prompter";
import { PromptType, Message } from "../types";
import { Choice } from "./choice";
import { ChoiceEntryBuilder } from "./choice-entry";
import { Choices } from "./choices";

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
        const choices = Choices.serialize(this._choices, context.local);

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
        return this;
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