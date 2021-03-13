import { Context } from "../questions";

export abstract class Helper {
    abstract run(context: Context): Promise<void>;
    abstract build(): any;
}
