import { Context, Questions } from ".";

export interface KeyValue<Value> {
    [key: string]: Value;
}

export type Answer = number | string | string[] | Answers;

export type Answers = KeyValue<Answer>;

export type Validator = (answer: Answer) => string | boolean;

export type Default = string | number | boolean | string[] | Function;

export type Message = string | ((answers: Answers) => string);

export type Filter = (answer: Answer) => Answer;

export type PromptType = "input" | "number" | "password" | "checkbox" | "list" | "rawlist" | "confirm" | "editor" | "expanded";

export type Name = string;

export type When = (answers: Answers) => boolean;


export type Callback = ((answer: Answer, context: Context) => Promise<Questions> | Questions);

export type CallbackExtended = Questions | Callback;