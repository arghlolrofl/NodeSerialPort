
export interface IPipelineTask {
    Priority: number;
    Name: string;
    Execute<T>(data: T): T;
}