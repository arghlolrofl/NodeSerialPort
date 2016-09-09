import * as EventEmitter from "eventemitter3";
import { EventNames } from "./../config/EventNames";

export class Heartbeat {
    //#region Events

    private events: EventEmitter3.EventEmitter = new EventEmitter();
    public get Events(): EventEmitter3.EventEmitter {
        return this.events;
    }

    //#endregion

    //#region Private Members

    private timer: NodeJS.Timer;
    private interval: number;

    //#endregion


    //#region Initialization

    /**
     * Creates a new heartbeat instance with the given interval
     *
     * @param interval Heartbeat interval in ms (default is 5000)
     */
    constructor(interval?: number) {
        this.interval = interval || 5000;
        if (this.interval < 1000) {
            this.interval = 1000;
        }
    }

    //#endregion


    /**
     * Starts the heartbeat timer, that raises an event
     * every time, the interval time has been elapsed.
     */
    public start(): void {
        console.log("Starting heartbeat ...");
        this.timer = setInterval(() => {
            this.events.emit(EventNames.Heartbeat.ELAPSED);
        }, this.interval);
    }

    /**
     * Stops the interval timer so that it no longer
     * raises elapsed events.
     */
    public stop(): void {
        console.log("Stopping heartbeat ...");
        clearInterval(this.timer);
    }
}