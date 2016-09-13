import * as EventEmitter from "eventemitter3";

export interface IBufferInput {
    Events: EventEmitter3.EventEmitter;

    registerEventForNewInput(eventName: string): void;
    pushBuffer(data: any): void;
}