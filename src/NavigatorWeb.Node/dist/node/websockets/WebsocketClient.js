/// <reference path="../../../typings/index.d.ts" />
"use strict";
var WebSocket = require("ws");
var core_1 = require("@angular/core");
var WebSocketClient = (function () {
    /**
     * Instantiates a new WebSocketClient instance.
     *
     * @param {callback} callback The function is going to be executed
     * when a weight update occurs.
     */
    function WebSocketClient(config) {
        this.config = config;
        this.messageReceived$ = new core_1.EventEmitter();
    }
    /**
     * Establishes a web socket connection to the scale service
     * and sets up all relevant callbacks.
     */
    WebSocketClient.prototype.connect = function () {
        console.log("[WEBSOCKET-CLIENT] Trying to connect to scale service at " + this.config.url);
        // establish connection
        this.webSocket = new WebSocket(this.config.url);
        // setup callbacks
        this.webSocket.on("open", this.WebSocket_OnOpen.bind(this));
        this.webSocket.on("message", this.WebSocket_OnMessage.bind(this));
        this.webSocket.on("error", this.WebSocket_OnError.bind(this));
        this.webSocket.on("close", this.WebSocket_OnClose.bind(this));
    };
    /**
     * @description Called, when a connection has been established.
     */
    WebSocketClient.prototype.WebSocket_OnOpen = function () {
        console.log("[WEBSOCKET-CLIENT] WebSocket client connection to ScaleMonitor has been established ...");
        this.isConnected = true;
        /**
         * If the connection can't be established or the server went down,
         * "setInterval" will try to reconnect periodically. Once the
         * connection has been reestablished, we need to cancel the "setInterval"
         * loop with "clearInterval".
         */
        if (typeof this.interval !== "undefined") {
            clearInterval(this.interval);
            this.interval = undefined;
        }
    };
    /**
     * @description Called, when the websocket client receives a message from the server.
     * @param {string} data The message sent by the websocket server
     * @param {object} flags The property "flags.binary" will be set if a binary data is received and
     *                       "flags.masked" will be set if the data was masked.
     */
    WebSocketClient.prototype.WebSocket_OnMessage = function (data, flags) {
        console.log("[WEBSOCKET-CLIENT] Received weight update from ScaleMonitor: " + data);
        // raise the event
        this.messageReceived$.emit(data);
    };
    /**
     * @description Called, when an error occurs when connecting or during connection.
     * @param {object} error Object containing information about the error.
     */
    WebSocketClient.prototype.WebSocket_OnError = function (error) {
        console.log("[WEBSOCKET-CLIENT ERROR]");
        console.info(error);
    };
    /**
     * @description Called, when the websocket connection to the scale monitor
     *              is being shut down or when the server is not reachable.
     */
    WebSocketClient.prototype.WebSocket_OnClose = function () {
        var _this = this;
        console.log("[WEBSOCKET-CLIENT] WebSocket client connection to ScaleMonitor has been closed ...");
        if (this.isConnected || typeof this.interval === "undefined") {
            this.webSocket.close();
            this.webSocket = undefined;
            this.interval = setInterval(function () { _this.connect(); }, 5000);
        }
        if (this.isConnected)
            this.isConnected = false;
    };
    return WebSocketClient;
}());
exports.WebSocketClient = WebSocketClient;
//# sourceMappingURL=WebsocketClient.js.map