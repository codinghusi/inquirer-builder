import { Message } from "../types";
import { InputBuilder } from "./input-builder";

export class NumberBuilder extends InputBuilder {
    constructor(message: Message) {
        super("number", message);
    }
}