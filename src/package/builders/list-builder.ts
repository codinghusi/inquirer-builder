import { Choices } from "../choices/choices";
import { ChoicesBuilder } from "../choices/choices-builder";
import { Message } from "../types";


export class ListBuilder extends ChoicesBuilder {
    constructor(message: Message, choices: Choices) {
        super("list", message, choices);
    }
}