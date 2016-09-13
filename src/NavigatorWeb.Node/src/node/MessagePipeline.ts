import * as EventEmitter from "eventemitter3";
import { EventNames } from "./config/EventNames";
import { IMessagePipeline } from "./interfaces/IMessagePipeline";
import { IBufferInput } from "./interfaces/IBufferInput";
import { IPipelineOutput } from "./interfaces/IPipelineOutput";
import { IPipelineTask } from "./interfaces/IPipelineTask";

/**
 * Simple implementation of the message pipeline pattern
 */
export class MessagePipeline<T> implements IMessagePipeline<T> {
    //#region Private Members

    private input: IBufferInput;
    private output: IPipelineOutput<T>;
    private tasks: Array<IPipelineTask>;
    private events: EventEmitter3.EventEmitter;
    private clientId: string;

    //#endregion

    //#region Properties

    /**
     * Getter for the pipeline entry point
     */
    public get Input(): IBufferInput { return this.input; }
    /**
     * Getter for the pipeline exit
     */
    public get Output(): IPipelineOutput<T> { return this.output; }
    /**
     * Getter for the list of registered tasks
     */
    public get Tasks(): Array<IPipelineTask> { return this.tasks; }

    //#endregion


    //#region Initialization

    /**
     * Creates and initializes a new instance of the MessagePipeline class.
     * 
     * @param receiver Entry point into the pipeline
     * @param sender Exit of the pipeline
     */
    constructor(receiver: IBufferInput, sender: IPipelineOutput<T>) {
        console.log("[PIPELINE] Initializing message pipeline ...");
        this.tasks = new Array<IPipelineTask>();
        this.events = new EventEmitter();

        this.input = receiver;
        this.output = sender;

        this.input.registerEventForNewInput(EventNames.PipelineInput.INPUT_READY);
        this.input.Events.on(
            EventNames.PipelineInput.INPUT_READY,
            (data: T) => {
                this.events.emit(EventNames.MessagePipeline.INPUT_READY_FOR_TASKS, data);
            }
        );

        this.events.on(
            EventNames.MessagePipeline.INPUT_READY_FOR_TASKS,
            (data: T) => {
                this.executeTasks(data);
            }
        );

        this.events.on(
            EventNames.MessagePipeline.READY_FOR_OUPUT,
            (data: T) => {
                this.output.sendData(data, this.clientId);
            }
        );
    }

    //#endregion


    /**
     * Sets the client id to provide output only for specific clients.
     * 
     * @param id
     */
    public setClientId(id: string): void {
        this.clientId = id;
    }

    /**
     * Registers a task for execution in the pipeline.
     +
     * @param task Pipeline task
     */
    public registerTask(task: IPipelineTask) {
        this.tasks.push(task);
    }

    /**
     * Takes new data and pushes it into the pipeline.
     * 
     * @param data
     */
    public takeInput(data: T): void {
        this.input.pushBuffer(data);
    }


    //#region Helpers

    /**
     * Executes all registered tasks inside the pipeline.
     *
     * @param data
     */
    private executeTasks(data: T): void {
        if (this.tasks.length > 0) {
            for (let i = 0; i < this.tasks.length; i++) {
                // Currently we don't care about task priorities
                data = this.tasks[i].Execute(data);
            }
        }

        this.events.emit(EventNames.MessagePipeline.READY_FOR_OUPUT, data);
    }

    //#endregion
}