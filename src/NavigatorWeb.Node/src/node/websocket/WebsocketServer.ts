/// <reference path="../../../typings/globals/socket.io/index.d.ts" />

import * as io from "socket.io";
import * as EventEmitter from "eventemitter3";

import { IPipelineOutput } from "./../interfaces/IPipelineOutput";

import { EventNames } from "./../config/EventNames";
import { Socket } from "./../../common/SocketChannels";
import { ClientRequest } from "./../../common/ClientRequest";

export class WebSocketServer<T> implements IPipelineOutput<T> {
    private lastErrorSent: Error;
    private lastErrorTimestamp: number;
    private repeatErrorThreshold: number = 500;

    private webSocket: SocketIO.Server;
    private port: number;
    private events: EventEmitter3.EventEmitter = new EventEmitter();

    private clientConnections: Array<SocketIO.Socket>;    

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
        this.clientConnections = new Array<SocketIO.Socket>();
    }

    /**
     * Listens for incoming connections.
     */
    public listen() {
        // create the server instance ...
        this.webSocket = io();
        // ... and after a connection has been established ...
        this.webSocket.on("connection", (socket: SocketIO.Socket) => {
            this.clientConnections.push(socket);

            // ... we subscribe to the client's request channel ...
            socket.on(Socket.Channels.CLIENT_REQUEST, (req: ClientRequest) => {
                console.log("[WEBSOCKET-SERVER] Client '" + req.clientId + "' requested: " + req.request + " ...");
                this.events.emit(EventNames.WebSocketServer.CLIENT_REQUEST_RECEIVED, req);
            });

            // ... and we also want to get notified, if a client disconnects
            socket.on("disconnect", () => {
                console.log("[WEBSOCKET-SERVER] Client '" + socket.client.id + "' disconnected ...");
                for (let i = 0; i < this.clientConnections.length; i++) {
                    if (this.clientConnections[i].id === socket.client.id) {
                        this.clientConnections.splice(i, 1);
                        return;
                    }
                }
            });

            // send the welcome message
            console.log("[WEBSOCKET-SERVER] Client '" + socket.client.id + "' connected ...");
            socket.emit(Socket.Channels.ID_EXCHANGE, socket.client.id);
            this.sendText("Welcome client '" + socket.client.id + "'!", socket.client.id);
        });

        this.webSocket = this.webSocket.listen(this.port);
        console.log("[WEBSOCKET-SERVER] Listening on port: " + this.port);        
    }
    
    /**
     * Sends a flag, if a device connection is established.
     *
     * @param msg Flag, if a device is connected via serial port.
     */
    public sendDeviceConnectionStatus(isConnected: boolean, socketClientId?: string): void {
        if (socketClientId == null || typeof socketClientId === 'undefined')
            return;

        this.webSocket.to("/#" + socketClientId).emit(Socket.Channels.CONNECTION_STATUS, isConnected);
    }

    /**
     * Sends a message to all web clients.
     *
     * @param msg Text to send
     */
    public sendText(msg: string, socketClientId?: string): void {
        if (socketClientId == null || typeof socketClientId === 'undefined')
            return;

        this.webSocket.to("/#" + socketClientId).emit(Socket.Channels.MESSAGE, msg);
    }

    /**
     * Updates all web clients witht the newly received buffer.
     *
     * @param {string} data Received buffer.
     */
    public sendData(data: T, socketClientId?: string): void {
        if (socketClientId == null || typeof socketClientId === 'undefined')
            return;

        this.webSocket.to("/#" + socketClientId).emit(Socket.Channels.DATA, data);
    }

    /**
     * Sends error to clients
     *
     * @param err Error object
     */
    public sendError(err: Error, socketClientId?: string): void {
        if (socketClientId == null || typeof socketClientId === 'undefined')
            return;

        // sometimes, the same error is being thrown multiple times,
        // but we want to send it to the client only once.
        if (typeof this.lastErrorSent !== 'undefined'
            && this.lastErrorSent.message === err.message
            && Date.now() < this.lastErrorTimestamp + this.repeatErrorThreshold) {
            return;
        }

        // Warning: When sending an Error object directly,
        // the client will only receive a plain and empty
        // js-object. So, we serialize it ourselves.
        this.webSocket.to("/#" + socketClientId).emit(Socket.Channels.EXCEPTION, {
            message: err.message,
            name: err.name,
            stack: err.stack
        });

        this.lastErrorSent = err;
        this.lastErrorTimestamp = Date.now();
    }
}