import { Choices } from "../choices/choices";
import { ChoicesBuilder } from "../choices/choices-builder";
import { Message } from "../types";


export class CheckboxBuilder extends ChoicesBuilder {
    constructor(message: Message, choices: Choices) {
        super("checkbox", message, choices);
    }
}