import { Answers } from "inquirer";
import { Context, prompter, text } from "../prompter";
import { Helper } from "./helper";

export type CustomMessage = string | ((answers: Answers, globalAnswers: Answers) => string);

export class MessageHelper implements Helper {
    constructor(public message: CustomMessage) { }

    async run(context: Context) {
        let message = this.message;
        if (typeof(message) === "function") {
            message = message(context.local, context.global);
        }
        await prompter([ text(message).prefix("").filter(() => "") ]);
    }

    build() {
        return null;
    }
}