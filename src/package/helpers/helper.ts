import { Context, prompter, prompterExtended as prompterExtended, Questions, removeUncaptured, text } from "../prompter";

export abstract class Helper {
    abstract run(context: Context): Promise<void>;
    abstract build(): any;
}
