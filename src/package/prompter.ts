import inquirer, { Answers } from "inquirer";
import { ChoiceEntryBuilder } from ".";
import { QuestionBuilder } from "./builders/builder";
import { CheckboxBuilder } from "./builders/checkbox-builder";
import { ConfirmBuilder } from "./builders/confirm-builder";
import { EditorBuilder } from "./builders/editor-builder";
import { ListBuilder } from "./builders/list-builder";
import { NumberBuilder } from "./builders/number-builder";
import { PasswordBuilder } from "./builders/password-builder";
import { RawListBuilder } from "./builders/rawlist-builder";
import { TextBuilder } from "./builders/text-builder";
import { Choices } from "./choices/choices";
import { Helper } from "./helpers/helper";
import { CustomMessage, MessageHelper } from "./helpers/message-helper";
import { SectionHelper } from "./helpers/section-helper";
import { Questions, SerializedQuestion, SerializedQuestions } from "./questions";

class Watcher {
    public promise: Promise<void>;
    private done: () => void;

    constructor(public amount: number) {
        const self = this;
        this.promise = new Promise(resolve => self.done = resolve);
    }

    decrement(amount: number) {
        this.amount -= amount;
    }

    async fire() {
        if (this.finished()) {
            this.done();
        }
    }

    finished() {
        return this.amount <= 0;
    }
}

export class Context {
    public queue: SerializedQuestions = [];
    private watchers: Watcher[] = []

    constructor(public local: Answers,
                public global: Answers,
                queue: Questions) {
        this.insert(queue);
    }
    
    nextQuestion() {
        this.watchers[0]?.decrement(1);
        return this.queue.splice(0, 1)?.[0];
    }
    
    async fireWatchers() {
        // this.watchers = this.watchers.filter(watcher => !watcher.finished());
        let watcher: Watcher;
        while (watcher = this.watchers[0]) {
            await watcher.fire();
            if (watcher.finished()) {
                this.watchers.splice(0, 1);
                continue;
            }
            break;
        }
    }

    insert(questions: Questions) {
        const serialized = Questions.serialize(questions);
        this.queue.splice(0, 0, ...serialized);
        const watcher = new Watcher(serialized.length);
        this.watchers.splice(0, 0, watcher);
        return watcher.promise;
    }
}


export async function prompter(questions: Questions, answers: Answers = {}) {
    return (await prompterExtended(new Context(answers, answers, questions)));
}

export function removeUncaptured(answers: Answers) {
    Object.keys(answers).filter(name => name.charAt(0) === "_")
                        .forEach(name => delete answers[name]);
}

export async function prompterExtended(context: Context) {
    while (context.queue.length) {
        const builder = context.nextQuestion();

        // If required put result into the global context
        if (builder instanceof Helper) {
            await builder.run(context);
            continue;
        }

        // Prompt and put the result into the current context
        const question = builder.build(context.local);
        const result = await inquirer.prompt([question], context.local);
        const answer = result[builder._name];

        Object.assign(context.local, result);
        
        // Work with builders itself
        if (builder instanceof QuestionBuilder) {
            // catch nested prompts
            await builder.handleAnswer(answer, context);
        }

        await context.fireWatchers();
    }

    // removing uncaptured questions (detected by underscore as prefix in name)
    removeUncaptured(context.local);
    removeUncaptured(context.global);
    context.nextQuestion(); // trigger last watcher // FIXME: very bad

    return context.global;
}

// FIXME: actually not building GlobalHelper (would be breaking the code)
export function buildPrompt(questions: SerializedQuestion[], answers: Answers = {}) {
    const builded = questions.map(question => {
        
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

export function section(name: string, body: Questions) {
    return new SectionHelper(name, body);
}

export function message(message: CustomMessage) {
    return new MessageHelper(message);
}