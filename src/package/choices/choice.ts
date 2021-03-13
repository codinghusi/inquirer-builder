import inquirer from "inquirer";
import { ChoiceEntryBuilder } from "./choice-entry";

export type Choice = SerializedChoice | string | inquirer.ChoiceOptions;
export type SerializedChoice = ChoiceEntryBuilder;

export const Choice = {
    serialize(choice: Choice) {
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