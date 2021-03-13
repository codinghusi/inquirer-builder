import { Message } from "./builder";
import { InputBuilder } from "./input-builder";


export class TextBuilder extends InputBuilder {
    constructor(message: Message) {
        super("input", message);
    }
}

export class NumberBuilder extends InputBuilder {
    constructor(message: Message) {
        super("number", message);
    }
}

export class EditorBuilder extends InputBuilder {
    constructor(message: Message) {
        super("editor", message);
    }
}

export class PasswordBuilder extends InputBuilder {
    constructor(message: Message) {
        super("password", message);
    }
}

