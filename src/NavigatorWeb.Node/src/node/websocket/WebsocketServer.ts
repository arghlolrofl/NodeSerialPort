/// <reference path="../../../typings/globals/socket.io/index.d.ts" />

import * as io from "socket.io";
import * as EventEmitter from "eventemitter3";

import { EventNames } from "./../config/EventNames";
import { SocketChannels } from "./../../common/SocketChannels";

export class WebSocketServer {
    private lastErrorSent: Error;
    private lastErrorTimestamp: number;
    private repeatErrorThreshold: number = 500;

    private webSocket: SocketIO.Server;
    private port: number;
    private events: EventEmitter3.EventEmitter = new EventEmitter();

    //#region Properties

    public get Events(): EventEmitter3.EventEmitter {
        return this.events;
    }

    //#endregion

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

        this.webSocket.on("connection", (socket: SocketIO.Socket) => {
            socket.on(SocketChannels.CLIENT_REQUEST, (message: string) => {
                console.log("[WEBSOCKET-SERVER] Client requested: '" + message + "' ...");
                this.events.emit(EventNames.WebSocketServer.CLIENT_REQUEST_RECEIVED, message);
            });

            console.log("[WEBSOCKET-SERVER] Client '" + socket.client.id + "' connected ...");
            this.sendMessage("Welcome client '" + socket.client.id + "'!");
        });
        
        this.webSocket.listen(this.port);
        console.log("[WEBSOCKET-SERVER] Listening on port: " + this.port);        
    }
    
    /**
     * Sends a flag, if a device connection is established.
     *
     * @param msg Flag, if a device is connected via serial port.
     */
    public sendDeviceConnectionStatus(isConnected: boolean) {
        this.webSocket.sockets.emit(SocketChannels.CONNECTION_STATUS, isConnected);
    }

    /**
     * Sends a message to all web clients.
     *
     * @param msg Text to send
     */
    public sendMessage(msg: string) {
        this.webSocket.sockets.emit(SocketChannels.MESSAGE, msg);
    }

    /**
     * Updates all web clients witht the newly received buffer.
     *
     * @param {string} data Received buffer.
     */
    public sendBuffer(data: Buffer): void {
        this.webSocket.sockets.emit(SocketChannels.DATA, data);
    }

    /**
     * Sends error to clients
     *
     * @param err Error object
     */
    public sendError(err: Error): void {
        if (typeof this.lastErrorSent !== 'undefined'
            && this.lastErrorSent.message === err.message
            && Date.now() < this.lastErrorTimestamp + this.repeatErrorThreshold) {
            return;
        }

        // Warning: When sending an Error object directly,
        // the client will only receive a plain and empty
        // js-object. So, we serialize it ourselves.
        this.webSocket.sockets.emit(SocketChannels.EXCEPTION, {
            message: err.message,
            name: err.name,
            stack: err.stack
        });

        this.lastErrorSent = err;
        this.lastErrorTimestamp = Date.now();
    }
}