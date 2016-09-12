/**
 * Simple DTO that can be stringified by socket.io
 */
export class ClientRequest {
    public clientId: string;
    public request: string;
}