
export interface IPipelineOutput<T> {
    sendData(data: T, clientId?: string): void;
}