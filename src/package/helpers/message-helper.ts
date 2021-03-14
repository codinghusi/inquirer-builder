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
        // const builder = text(message).prefix("").filter(() => "");
        const builder = text("lol");
        context.global.test = JSON.stringify(builder.build(context.local));
        console.log(context.global.test);
        context.insert([ builder ]);
    }
}