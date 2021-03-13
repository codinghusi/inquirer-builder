import { QuestionBuilder } from "../builder";
import { Context } from "../../prompter";
import { CallbackExtended, Answer } from "../../types";



export class ConfirmBuilder extends QuestionBuilder {
    _then: CallbackExtended;
    _else: CallbackExtended;

    constructor(message: string) {
        super("confirm", message);
    }

    async handleAnswer(answer: Answer, context: Context) {
        await super.handleAnswer(answer, context);

        if (answer) {
            await this.runQuestions(this._then, answer, context);
        } else {
            await this.runQuestions(this._else, answer, context);
        }
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