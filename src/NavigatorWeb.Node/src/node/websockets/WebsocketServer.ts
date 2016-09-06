/// <reference path="../../../typings/globals/socket.io/index.d.ts" />

import * as io from "socket.io";
//import { ConfigurationService, NodeWebSocketServerConfiguration } from "../node.config";

export class WebSocketServer {
    // web socket server instance
    private webSocket: SocketIO.Server;
    // global configuration service
    private config: any;

    /**
     * Instantiates a new instance of a WebSocket server.
     */
    constructor(config: any) {
        this.config = config;
    }

    /**
     * Listens for incoming connections.
     */
    public listen() {
        this.webSocket = io();

        this.webSocket.on("connection", function (socket: SocketIO.Socket) {
            console.log("[WEBSOCKET-SERVER] Client '" + socket.client.id + "' connected ...");
        });

        this.webSocket.listen(this.config.port);
        console.log("[WEBSOCKET-SERVER] Listening on port: " + this.config.port);
    }

    /**
     * Updates all web clients witht the new weight.
     *
     * @param {string} data Updated weight (as string).
     */
    public updateClients(data: string): void {
        console.log("[WEBSOCKET-SERVER] Updating web clients now ...");
        this.webSocket.sockets.emit("weightUpdate", data);
    }
}