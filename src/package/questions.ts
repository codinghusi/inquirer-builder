import inquirer, { Answers } from "inquirer";
import { QuestionBuilder } from "./builders/builder";
import { SectionHelper } from "./helpers/section-helper";
import { Answer, CallbackExtended, KeyValue } from "./types";
import { Helper } from "./helpers/helper";
import { Context } from "./prompter";

export type SerializedQuestion = QuestionBuilder | Helper;
export type SerializedQuestions = SerializedQuestion[];

export type Question = SerializedQuestion | inquirer.Question;
export type Questions = Helper | Question[] | KeyValue<Question>;


export const Question = {
    build(question: Question, answers: Answers): inquirer.Question {
        if (question instanceof QuestionBuilder) {
            return question.build(answers);
        }
        if (question instanceof Helper) {
            return null;
        }
        return question;
    }
};

export const Questions = {
    from(questions: inquirer.Question[]) {
        return questions.map(QuestionBuilder.from);
    },
    serialize(questions: Questions): SerializedQuestions {
        if (Array.isArray(questions)) {
            return this.from(questions);
        }

        if (typeof(questions) !== "object") {
            return [];
        }

        if (questions instanceof Helper) {
            return [questions];
        }
        
        return Object.entries(questions).map(([name, question]) => {
            if (!question) {
                return null;
            }
            if (question instanceof QuestionBuilder) {
                question.name(name);
            } else if (question instanceof Helper) {
                // Currently no idea if names are needed here
            } else {
                question = QuestionBuilder.from(question);
                question.name(name);
            }
            return question;
        }).filter(question => !!question);
    },

    async serializeCallback(questions: CallbackExtended, answer: Answer, context: Context) {
        if (typeof(questions) === "function") {
            return await questions?.(answer, context);
        }
        return questions;
    }
}