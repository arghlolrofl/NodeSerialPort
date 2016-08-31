/// <reference path="../../../typings/index.d.ts" />

import * as WebSocket from 'ws';
import { EventEmitter } from '@angular/core';
import { ConfigurationService, NodeWebSocketClientConfiguration } from './../node.config';

export class NodeWebSocketClient {
    // connection status identifier
    private isConnected: boolean;
    // the socket connection object
    private webSocket: WebSocket;
    // the interval/cancellation token
    private interval: NodeJS.Timer;
    // global configuration service
    private config: NodeWebSocketClientConfiguration;
    // weight update event
    public messageReceived$: EventEmitter<string>;


    /**
     * Instantiates a new WebSocketClient instance.
     * 
     * @param {callback} callback The function is going to be executed
     * when a weight update occurs.
     */
    constructor() {
        this.config = new ConfigurationService().WebSocketClientConfiguration;
        this.messageReceived$ = new EventEmitter();
    }

    
    /**
     * Establishes a web socket connection to the scale service
     * and sets up all relevant callbacks.
     */
    public connect(): void {
        console.log("[WEBSOCKET-CLIENT] Trying to connect to scale service at " + this.config.URL);

        // establish connection
        this.webSocket = new WebSocket(this.config.URL);
        // setup callbacks
        this.webSocket.on('open', this.WebSocket_OnOpen.bind(this));
        this.webSocket.on('message', this.WebSocket_OnMessage.bind(this));
        this.webSocket.on('error', this.WebSocket_OnError.bind(this));
        this.webSocket.on('close', this.WebSocket_OnClose.bind(this));
    }

    /**
     * @description Called, when a connection has been established.
     */
    private WebSocket_OnOpen(): void {
        console.log("[WEBSOCKET-CLIENT] WebSocket client connection to ScaleMonitor has been established ...");
        this.isConnected = true;

        /**
         * If the connection can't be established or the server went down,
         * 'setInterval' will try to reconnect periodically. Once the 
         * connection has been reestablished, we need to cancel the 'setInterval'
         * loop with 'clearInterval'.
         */
        if (typeof this.interval !== 'undefined') {
            clearInterval(this.interval);
            this.interval = undefined;
        }
    }

    /**
     * @description Called, when the websocket client receives a message from the server.
     * @param {string} data The message sent by the websocket server
     * @param {object} flags The property 'flags.binary' will be set if a binary data is received and
     *                       'flags.masked' will be set if the data was masked.
     */
    private WebSocket_OnMessage(data: string, flags: any): void {
        console.log("[WEBSOCKET-CLIENT] Received weight update from ScaleMonitor: " + data);

        // raise the event
        this.messageReceived$.emit(data);
    }

    /**
     * @description Called, when an error occurs when connecting or during connection.
     * @param {object} error Object containing information about the error.
     */
    private WebSocket_OnError(error: any): void {
        console.log("[WEBSOCKET-CLIENT ERROR]");
        console.info(error);
    }

    /**
     * @description Called, when the websocket connection to the scale monitor
     *              is being shut down or when the server is not reachable.
     */
    private WebSocket_OnClose(): void {
        console.log("[WEBSOCKET-CLIENT] WebSocket client connection to ScaleMonitor has been closed ...");

        if (this.isConnected || typeof this.interval === 'undefined') {
            this.webSocket.close();
            this.webSocket = undefined;
            this.interval = setInterval(() => { this.connect(); }, 5000);
        }

        if (this.isConnected)
            this.isConnected = false;
    }
}