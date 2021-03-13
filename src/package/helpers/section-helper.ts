import { Helper, Questions, Context, prompterExtended, removeUncaptured } from "..";

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

        await prompterExtended(this.body, context);
        removeUncaptured(context.local);
        context.global[this.name] = context.local;

        context.local = tmpLocal;
    }

    build() {
        return this.body;
    }
}