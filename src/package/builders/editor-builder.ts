import { Message } from "../types";
import { InputBuilder } from "./input-builder";

export class EditorBuilder extends InputBuilder {
    constructor(message: Message) {
        super("editor", message);
    }
}



