import { Message } from "./builder";
import { Choices, ChoicesBuilder } from "./choices-builder";


export class CheckboxBuilder extends ChoicesBuilder {
    constructor(message: Message, choices: Choices) {
        super("checkbox", message, choices);
    }
}

export class ListBuilder extends ChoicesBuilder {
    constructor(message: Message, choices: Choices) {
        super("list", message, choices);
    }
}

export class RawListBuilder extends ChoicesBuilder {
    constructor(message: Message, choices: Choices) {
        super("rawlist", message, choices);
    }
}