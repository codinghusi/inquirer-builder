import { ChoicesBuilder, Choices } from "../../choices-builder";
import { Message } from "../../types";


export class CheckboxBuilder extends ChoicesBuilder {
    constructor(message: Message, choices: Choices) {
        super("checkbox", message, choices);
    }
}