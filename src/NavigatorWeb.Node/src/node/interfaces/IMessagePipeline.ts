import { IBufferInput } from "./IBufferInput";
import { IPipelineOutput } from "./IPipelineOutput";
import { IPipelineTask } from "./IPipelineTask";


export interface IMessagePipeline<T> {
    Input: IBufferInput;
    Output: IPipelineOutput<T>;
    Tasks: Array<IPipelineTask>;

    setClientId(id: string): void;
    registerTask(task: IPipelineTask): void;
    takeInput(data: T): void;
}