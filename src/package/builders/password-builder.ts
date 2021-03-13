import { Message } from "../types";
import { InputBuilder } from "./input-builder";

export class PasswordBuilder extends InputBuilder {
    constructor(message: Message) {
        super("password", message);
    }
}