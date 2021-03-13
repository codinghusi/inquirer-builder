import inquirer from "inquirer";
import { Answer, Answers, QuestionBuilder } from "./builder";
import { ConfirmBuilder } from "./builders";
import { ChoiceEntryBuilder } from "./choice-entry";
import { Choices, ChoicesBuilder } from "./choices-builder";
import { CheckboxBuilder, ListBuilder, RawListBuilder } from "./choices-builders";
import { GlobalHelper as NestedHelper } from "./helper";
import { EditorBuilder, NumberBuilder, PasswordBuilder, TextBuilder } from "./input-builders";
import { KeyValue } from "./utils";

export type Question = QuestionBuilder | inquirer.Question;
export type Questions = NestedHelper | Question[] | KeyValue<Question> | (() => Questions);

export interface Context {
    local: Answers,
    global: Answers
}

const Questions = {
    uniform(questions: Questions) {
        if (Array.isArray(questions)) {
            return questions;
        }

        if (typeof(questions) !== "object") {
            return [];
        }

        if (questions instanceof NestedHelper) {
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

export async function prompter(questions: Questions, answers: Answers = {}) {
    return (await prompterExtended(questions, {
        local: answers,
        global: answers
    }));
}

export function removeUncaptured(answers: Answers) {
    Object.keys(answers).filter(name => name.charAt(0) === "_")
                        .forEach(name => delete answers[name]);
}

export async function prompterExtended(questions: Questions, context: Context) {
    const unifiedQuestions = Questions.uniform(questions);
    const builded = buildPrompt(questions, context.global);
    let i = 0;
    for (const question of builded) {
        const builder = unifiedQuestions[i++];

        // If required put result into the global context
        if (builder instanceof NestedHelper) {
            await builder.run(context);
            continue;
        }

        // Prompt and put the result into the current context
        const result = await inquirer.prompt([question], context.local);
        const answer = result[question.name];

        Object.assign(context.local, result);
        
        // Work with builders itself
        if (builder instanceof QuestionBuilder) {
            // catch nested prompts
            await builder.handleAnswer(answer, context);
        }
    }

    // removing uncaptured questions (detected by underscore as prefix in name)
    removeUncaptured(context.local);
    removeUncaptured(context.global);

    return context.global;
}

// FIXME: actually not building GlobalHelper (would be breaking the code)
export function buildPrompt(questions: Questions, answers: Answers = {}) {
    const uniformed = Questions.uniform(questions);
    const builded = uniformed.map(question => {
        if (question instanceof QuestionBuilder) {
            return question.build(answers);
        }
        if (question instanceof NestedHelper) {
            return question.build();
        }
        return question;
    });
    return builded;
}

export function text(message: string) {
    return new TextBuilder(message);
}

export function number(message: string) {
    return new NumberBuilder(message);
}

export function password(message: string) {
    return new PasswordBuilder(message);
}

// TODO: add a 'catpure' flag  (so that you don't have to save the result of your confirm). Same could be done for list or checkbox
export function yesno(message: string) {
    return new ConfirmBuilder(message);
}

export function editor(message: string) {
    return new EditorBuilder(message);
}

export function checkbox(message: string, choices: Choices) {
    return new CheckboxBuilder(message, choices);
}

export function select(message: string, choices: Choices) {
    return new ListBuilder(message, choices);
}

export function rawlist(message: string, choices: Choices) {
    return new RawListBuilder(message, choices);
}


export function entry(displayName: string) {
    return new ChoiceEntryBuilder(displayName);
}

export function nested(name: string, body: Questions) {
    return new NestedHelper(name, body);
}