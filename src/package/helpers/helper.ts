import { Context } from "../prompter";

export abstract class Helper {
    abstract run(context: Context): Promise<void>;
}