import { Choices } from "../choices/choices";
import { ChoicesBuilder } from "../choices/choices-builder";
import { Message } from "../types";


export class RawListBuilder extends ChoicesBuilder {
    constructor(message: Message, choices: Choices) {
        super("rawlist", message, choices);
    }
}