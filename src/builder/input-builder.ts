import { Answer, QuestionBuilder } from "./builder";


export abstract class InputBuilder extends QuestionBuilder {
    _filter: (answer: Answer) => Answer;
    _transformer: (answer: Answer) => Answer;

    filter(filter: (answer: Answer) => Answer) {
        this._filter = filter;
        return this;
    }

    transformer(transformer: (answer: Answer) => Answer) {
        this._transformer = transformer;
        return this;
    }
}