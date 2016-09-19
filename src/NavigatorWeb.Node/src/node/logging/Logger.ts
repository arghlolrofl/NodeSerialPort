import { Environment } from "./../enums/Environment";
import { ICanLog } from "./../interfaces/ICanLog";

/**
 * Logger class
 */
export class Logger implements ICanLog {
    private environment: Environment;

    constructor(env: Environment) {
        this.environment = env;
    }

    /**
     * Default logging method.
     *
     * @param message Message to log
     */
    public log(message: string) {
        if (this.environment === Environment.DEBUG) {
            console.log(message);
        }
    }

    /**
     * Equivalent to console.info("foo message")
     *
     * @param message Message to log
     */
    public info(message: string) {
        if (this.environment === Environment.DEBUG) {
            console.info(message);
        }
    }

    /**
     * Equivalent to console.trace("bar message")
     *
     * @param message Message to log
     */
    public trace(message: string) {
        if (this.environment === Environment.DEBUG) {
            console.trace(message);
        }
    }

    /**
     * Equivalent to console.info(foobarObject)
     *
     * @param message Message to log
     */
    public dump(object: any) {
        if (this.environment === Environment.DEBUG) {
            console.info(object);
        }
    }

    /**
     * Equivalent to console.error(err)
     *
     * @param message Message to log
     */
    public error(error: any): void {
        if (this.environment === Environment.DEBUG) {
            console.error(error);
        }
    }
}