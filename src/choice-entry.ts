import inquirer, { Answers, QuestionCollection } from "inquirer";
import { Context, prompter, prompterExtended, Questions } from "./prompter";

type SelectEvent = (choice: ChoiceEntryBuilder) => Promise<Questions> | Questions;

// FIXME: disabled and checked have no effect

export class ChoiceEntryBuilder {
    _displayName: string;
    _short: string;
    _value: string;
    _disabled: boolean;
    _onSelect: SelectEvent;
    _checked: boolean;

    static from(choice: inquirer.ChoiceOptions) {
        const builder = new ChoiceEntryBuilder(choice.name);
        builder.short(choice.short);
        builder.value(choice.value);
        // builder.disabled(choice.disabled);
        // builder.checked(choice.checked);
        return builder;
    }

    constructor(displayName: string) {
        this.displayName(displayName);
    }

    displayName(name: string) {
        this._displayName = name;
        return this;
    }

    short(short: string) {
        this._short = short;
        return this;
    }

    value(value: string) {
        this._value = value;
        return this;
    }

    disabled(disabled: boolean) {
        this._disabled = disabled;
        return this;
    }

    onSelect(onSelect: SelectEvent) {
        this._onSelect = onSelect;
        return this;
    }

    async runNested(context: Context) {
        const questions = await this._onSelect?.(this);
        if (questions) {
            await prompterExtended(questions, context);
        }
    }

    then(questions: Questions) {
        this.onSelect(() => questions);
        return this;
    }

    checked(checked: boolean) { 
        this._checked = checked;
        return this;
    }

    build() {
        return {
            name: this._displayName ?? this._short,
            short: this._short ?? this._displayName,
            value: this._value ?? this._displayName,
            disabled: this._disabled,
            checked: this._checked
        };
    }
}