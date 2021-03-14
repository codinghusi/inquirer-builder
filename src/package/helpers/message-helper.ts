import { Answers } from "inquirer";
import { Context, prompter, text } from "../prompter";
import { Helper } from "./helper";

export type CustomMessage = string | ((answers: Answers, globalAnswers: Answers) => string);

export class MessageHelper extends Helper {
    constructor(public message: CustomMessage) {
        super();
    }

    async run(context: Context) {
        let message = this.message;
        if (typeof(message) === "function") {
            message = message(context.local, context.global);
        }
        // FIXME: this one is not queued..
        console.log(message);
    }
}