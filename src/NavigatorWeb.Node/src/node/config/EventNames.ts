export namespace EventNames {
    export namespace Heartbeat {
        export const ELAPSED = "heartbeat-interval-elapsed";
    }

    export namespace MessageAggregator {
        export const BUFFER_ASSEMBLING_COMPLETED = "new-buffer-assembled";
    }

    export namespace SerialLink {
        export const DEVICE_CONNECTION_STATUS_CHANGED = "device-connection-status-changed";
        export const CONNECTION_ERROR_OCCURED = "connection-error-ocurred";
        export const BUFFER_RECEIVED = "buffer-received";
    }

    export namespace WebSocketServer {
        export const CLIENT_REQUEST_RECEIVED = "client-request-received";
    }
}