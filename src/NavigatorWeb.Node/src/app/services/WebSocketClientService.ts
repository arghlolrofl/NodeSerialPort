/// <reference path="../../../typings/globals/socket.io-client/index.d.ts" />

import * as EventEmitter from "eventemitter3";

import { Injectable } from "@angular/core";

import { EventNames } from "./../EventNames";
import { SocketChannels } from "./../../common/SocketChannels";

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
    private isConnectedToDevice: boolean = false;
    private events: EventEmitter3.EventEmitter = new EventEmitter();

    //#endregion

    //#region Properties

    /**
     * Device connection status
     */
    public get IsConnectedToDevice(): boolean { return this.isConnectedToDevice; }
    public get Events(): EventEmitter3.EventEmitter { return this.events; }

    //#endregion
    

    /**
     * Establishes a web socket connection to a web socket server
     */
    public connect(): void {
        console.log("Connecting to web socket server ...");

        this.socket = io("http://10.34.2.110:55667");
        // connect ...        
        this.socket.on("connect", () => {
            // ... and subscribe to all message channels
            this.socket.on(SocketChannels.MESSAGE, (data: string) => {
                this.events.emit(EventNames.WebSocketClientService.MESSAGE_RECEIVED, data);
            });

            this.socket.on(SocketChannels.DATA, (data: ArrayBuffer) => {
                // we cannot directly manipulate an ArrayBuffer,
                // so we create a view to the buffer via an Int8Array
                // see: https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer
                this.events.emit(EventNames.WebSocketClientService.DATA_RECEIVED, new Int8Array(data));
            });

            this.socket.on(SocketChannels.CONNECTION_STATUS, (isDeviceConnected: boolean) => {
                this.events.emit(EventNames.WebSocketClientService.DEVICE_CONNECTION_STATUS_CHANGE_RECEIVED, isDeviceConnected);
            });

            this.socket.on(SocketChannels.EXCEPTION, (err: Error) => {
                this.events.emit(EventNames.WebSocketClientService.SERVER_ERROR_RECEIVED, err); 
            });
        });
    }

    public request(message: string) {
        console.info("Sending request: " + message);
        this.socket.emit(SocketChannels.CLIENT_REQUEST, message);
    }
}