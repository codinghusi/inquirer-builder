import { Answers } from "./builder";
import { Context, prompter, prompterExtended as prompterExtended, Questions, removeUncaptured, text } from "./prompter";

export abstract class Helper {
    abstract run(context: Context): Promise<void>;
    abstract build(): any;
}

// TODO: add askAnswered
export class GlobalHelper extends Helper {
    _askAnswered = false;

    constructor(public name: string,
                public body: Questions) {
        super();
    }

    askAnswered(askAnswered: boolean) {
        this._askAnswered = askAnswered;
        return this;
    }

    async run(context: Context) {
        if (this.name in context.global && !this._askAnswered) {
            return;
        }

        const tmpLocal = context.local;
        context.local = {};

        await prompterExtended(this.body, context);
        removeUncaptured(context.local);
        context.global[this.name] = context.local;

        context.local = tmpLocal;
    }

    build() {
        return this.body;
    }
}

export type Message = string | ((answers: Answers, globalAnswers: Answers) => string);

export class MessageHelper implements Helper {
    constructor(public message: Message) { }

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