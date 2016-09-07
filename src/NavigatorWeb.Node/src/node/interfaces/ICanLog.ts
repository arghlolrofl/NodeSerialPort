export interface ICanLog {
    log(message: string): void;
    info(message: string): void;
    trace(message: string): void;
    dump(object: any): void;

    error(error: any): void;
}