import inquirer, { Answers } from "inquirer";
import { ChoiceEntryBuilder } from "..";
import { KeyValue } from "../types";
import { Choice, SerializedChoice } from "./choice";

export type Choices = KeyValue<Choice> | Choice[] | ((answers: Answers) => Choice[]);
export type SerializedChoices = SerializedChoice[];

export const Choices = {
    serializeWithoutFn(choices: Choices): SerializedChoices {
        // Handle the Array
        if (Array.isArray(choices)) {
            return choices.map(Choice.serialize);
        }

        // Handle {[value]: string | ChoiceEntryBuilder}
        if (typeof(choices) === "object") {
            return Object.entries(choices).map(([value, choice]) => {
                choice = Choice.serialize(choice);
                choice.value(value);
                return choice;
            });
        }

        throw "choices have wrong type";
    },
    serialize(choices: Choices, answers: Answers): ChoiceEntryBuilder[] {
        // Handle the function
        if (typeof(choices) === "function") {
            return Choices.serialize(choices(answers), answers);
        }

        // Handle others
        return this.serializeWithoutFn(choices);
    },
    build(choices: Choices, answers: Answers): inquirer.ChoiceOptions[] | (() => inquirer.ChoiceOptions[]) {
        // Handle the function
        if (typeof(choices) === "function") {
            return () => Choices.serialize(choices(answers), answers).map(choice => choice.build());
        }

        // Handle others
        return Choices.serializeWithoutFn(choices).map(choice => choice.build());
    }
}