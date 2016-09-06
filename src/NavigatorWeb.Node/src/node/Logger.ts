import { Environment } from "./Environment";

export class Logger {
    private environment: Environment;

    constructor(env: Environment) {
        this.environment = env;
    }

    public log(msg: string) {
        if (this.environment === Environment.DEBUG) {
            console.log(msg);
        }
    }

    public dump(obj: any) {
        if (this.environment === Environment.DEBUG) {
            console.info(obj);
        }
    }

    public error(err: any) {
        if (this.environment === Environment.DEBUG) {
            console.error(err);
        }
    }
}