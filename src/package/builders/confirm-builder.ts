import { QuestionBuilder } from "./builder";
import { Questions } from "../questions";
import { Answer, CallbackExtended } from "../types";
import { Context, prompterExtended } from "../prompter";



export class ConfirmBuilder extends QuestionBuilder {
    _then: CallbackExtended;
    _else: CallbackExtended;

    constructor(message: string) {
        super("confirm", message);
    }

    async handleAnswer(answer: Answer, context: Context) {
        await super.handleAnswer(answer, context);

        let questions: Questions;
        if (answer) {
            questions = await Questions.serializeCallback(this._then, answer, context);
        } else {
            questions = await Questions.serializeCallback(this._else, answer, context);
        }
        context.insert(questions);
    }

    then(then: CallbackExtended) {
        this._then = then;
        return this;
    }

    else(_else: CallbackExtended) {
        this._else = _else;
        return this;
    }
}