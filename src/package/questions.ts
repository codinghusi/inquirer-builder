import inquirer, { Answers } from "inquirer";
import { Helper } from ".";
import { QuestionBuilder } from "./builders/builder";
import { SectionHelper } from "./helpers/section-helper";
import { KeyValue } from "./types";

export type Question = QuestionBuilder | inquirer.Question | Helper;
export type Questions = Helper | Question[] | KeyValue<Question> | (() => Questions);

export interface Context {
    local: Answers,
    global: Answers
}

export const Questions = {
    uniform(questions: Questions) {
        if (Array.isArray(questions)) {
            return questions;
        }

        if (typeof(questions) !== "object") {
            return [];
        }

        if (questions instanceof SectionHelper) {
            return [questions];
        }
        
        return Object.entries(questions).map(([name, question]) => {
            if (question instanceof QuestionBuilder) {
                question.name(name);
            } else {
                question.name = name;
            }
            return question;
        });
    }
}