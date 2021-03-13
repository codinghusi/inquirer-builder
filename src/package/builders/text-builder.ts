import { Message } from "../types";
import { InputBuilder } from "./input-builder";

export class TextBuilder extends InputBuilder {
    constructor(message: Message) {
        super("input", message);
    }
}