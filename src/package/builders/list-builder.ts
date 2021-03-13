import { ChoicesBuilder, Choices } from "../../choices-builder";
import { Message } from "../../types";


export class ListBuilder extends ChoicesBuilder {
    constructor(message: Message, choices: Choices) {
        super("list", message, choices);
    }
}