/// <reference path="../../../typings/globals/socket.io-client/index.d.ts" />

import * as EventEmitter from "eventemitter3";

import { Injectable } from "@angular/core";

import { EventNames } from "./../EventNames";
import { Socket } from "./../../common/SocketChannels";
import { ClientRequest } from "./../../common/ClientRequest";

declare var io: SocketIOClientStatic;


/**
 * WebSocketClientService is being injected into the Angular2 AppComponent
 * (Weight Monitor) and is responsible to establish a WebSocket connection
 * to the Web-Server.
 */
@Injectable()
export class WebSocketClientService {
    //#region Private Members

    private socket: SocketIOClient.Socket;
    private clientId: string;
    private isConnectedToDevice: boolean = false;
    private events: EventEmitter3.EventEmitter = new EventEmitter();

    //#endregion

    //#region Properties

    /**
     * Device connection status
     */
    public get IsConnectedToDevice(): boolean { return this.isConnectedToDevice; }
    /**
     * WebSocketClientService's event emitter (see src/app/EventNames for
     * possible events being raised).
     */
    public get Events(): EventEmitter3.EventEmitter { return this.events; }
    /**
     * Getter for client id
     */
    public get ClientId(): string { return this.clientId; }

    //#endregion


    /**
     * Establishes a web socket connection to a web socket server
     */
    public connect(): void {
        console.log("Connecting to web socket server ...");

        // connect to server ...
        this.socket = io("http://10.34.2.59:55667");
        // ... and ...
        this.socket.on("connect", () => {
            // ... subscribe to id exchange channel
            this.socket.on(Socket.Channels.ID_EXCHANGE, (id: string) => {
                this.clientId = id;
            });

            // ... subscribe to message channel
            this.socket.on(Socket.Channels.MESSAGE, (data: string) => {
                this.events.emit(EventNames.WebSocketClientService.MESSAGE_RECEIVED, data);
            });

            // ... subscribe to data channel
            this.socket.on(Socket.Channels.DATA, (data: ArrayBuffer) => {
                // we cannot directly manipulate an ArrayBuffer,
                // so we create a view to the buffer via an Int8Array
                // see: https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer
                this.events.emit(EventNames.WebSocketClientService.DATA_RECEIVED, new Int8Array(data));
            });

            // ... subscribe to connection status channel
            this.socket.on(Socket.Channels.CONNECTION_STATUS, (isDeviceConnected: boolean) => {
                this.events.emit(EventNames.WebSocketClientService.DEVICE_CONNECTION_STATUS_CHANGE_RECEIVED, isDeviceConnected);
            });

            // ... subscribe to error channel
            this.socket.on(Socket.Channels.EXCEPTION, (err: Error) => {
                this.events.emit(EventNames.WebSocketClientService.SERVER_ERROR_RECEIVED, err);
            });
        });
    }

    /**
     * Sends a client request to the websocket server
     *
     * @param message Request message
     */
    public request(message: string) {
        let req: ClientRequest = new ClientRequest();
        req.clientId = this.clientId;
        req.request = message;

        console.log("Sending request:");
        console.info(req);
        this.socket.emit(Socket.Channels.CLIENT_REQUEST, req);
    }
}