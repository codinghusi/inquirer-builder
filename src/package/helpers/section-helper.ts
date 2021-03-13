import { Context, removeUncaptured } from "../prompter";
import { Questions } from "../questions";
import { Helper } from "./helper";

export class SectionHelper extends Helper {
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

        context.insert(this.body);
        removeUncaptured(context.local); // FIXME: currently not working cause this will be executed later
        context.global[this.name] = context.local;

        context.local = tmpLocal;
    }
}