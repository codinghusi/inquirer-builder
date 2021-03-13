import inquirer from "inquirer";
import { Context, prompter, prompterExtended, Questions } from "./prompter";
import { KeyValue } from "./utils";

type Answer = number | string | string[] | Answers;

type Answers = KeyValue<Answer>;

type Validator = (answer: Answer) => string | boolean;

type Default = string | number | boolean | string[] | Function;

type Message = string | ((answers: Answers) => string);

type Filter = (answer: Answer) => Answer;

type PromptType = "input" | "number" | "password" | "checkbox" | "list" | "rawlist" | "confirm" | "editor" | "expanded";

type Name = string;

type When = (answers: Answers) => boolean;

export type {
    Answer, Answers, Validator, Default, Message, Filter, PromptType, Name, When
};

let autogeneratedNameId = 0;


export type Callback = ((answer: Answer, context: Context) => Promise<Questions> | Questions);

export type CallbackExtended = Questions | Callback;



export abstract class QuestionBuilder {
    _validators: Validator[] = [];
    _default: Default;
    _when: When;
    _prefix: string;
    _suffix: string;
    _message: Message;
    _name: string;
    _askAnswered: boolean;
    _onAnswered: Callback;

    constructor(public type: PromptType, message: Message) {
        this.message(message);
    }

    validate(...validators: Validator[]) {
        this._validators.push(...validators);
        return this;
    }

    default(def: Default) {
        this._default = def;
        return this;
    }

    when(when: When) {
        this._when = when;
        return this;
    }

    prefix(prefix: string) {
        this._prefix = prefix;
        return this;
    }

    suffix(suffix: string) {
        this._suffix = suffix;
        return this;
    }

    message(message: Message) {
        this._message = message;
        return this;
    }

    name(name: Name) {
        this._name = name;
        return this;
    }

    askAnswered(ask: boolean) {
        this._askAnswered = ask;
        return this;
    }

    async handleAnswer(answer: Answer, context: Context) {
        await this._onAnswered?.(answer, context);
    }

    protected async runQuestions(callback: CallbackExtended, answer: Answer, context: Context) {
        const questions = typeof(callback) === "function" ? await callback?.(answer, context) : callback;
        if (questions) {
            await prompterExtended(questions, context);
        }
    }

    onAnswered(onAnswered: Callback) {
        this._onAnswered = onAnswered;
        return this;
    }

    build(answers: Answers) {
        // Autogenerate the name if none given
        if (!this._name) {
            this.name(`_unnamed${autogeneratedNameId++}`);
        }
        
        // Serialize validators to one function validator
        const validators = this._validators.slice();
        const validate = (answer: Answer) => {
            for (const validator of validators) {
                const result = validator(answer);
                if (!result || typeof(result) === 'string') {
                    return result;
                }
            }
            return true;
        };

        // return everything
        return {
            type: this.type,
            name: this._name,
            message: this._message,
            prefix: this._prefix,
            suffix: this._suffix,
            default: this._default,
            when: this._when,
            validate,
            askAnswered: this._askAnswered
        }
    }
}