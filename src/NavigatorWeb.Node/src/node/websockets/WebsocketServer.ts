/// <reference path="../../../typings/globals/socket.io/index.d.ts" />

import * as io from "socket.io";

export class WebSocketServer {
    // web socket server instance
    private webSocket: SocketIO.Server;
    // web socket server's port
    private port: number;

    /**
     * Instantiates a new instance of a WebSocket server.
     */
    constructor(port: number) {
        this.port = port;
    }

    /**
     * Listens for incoming connections.
     */
    public listen() {
        this.webSocket = io();

        this.webSocket.on("connection", function (socket: SocketIO.Socket) {
            console.log("[WEBSOCKET-SERVER] Client '" + socket.client.id + "' connected ...");
        });

        this.webSocket.listen(this.port);
        console.log("[WEBSOCKET-SERVER] Listening on port: " + this.port);
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