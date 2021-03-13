import inquirer, { Answers } from "inquirer";
import { ChoiceEntryBuilder } from "..";
import { KeyValue } from "../types";
import { Choice } from "./choice";

export type Choices = KeyValue<Choice> | Choice[] | ((answers: Answers) => Choice[]);

export const Choices = {
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