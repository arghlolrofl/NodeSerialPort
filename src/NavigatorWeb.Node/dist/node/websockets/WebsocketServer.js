/// <reference path="../../../typings/globals/socket.io/index.d.ts" />
"use strict";
var io = require("socket.io");
//import { ConfigurationService, NodeWebSocketServerConfiguration } from "../node.config";
var WebSocketServer = (function () {
    /**
     * Instantiates a new instance of a WebSocket server.
     */
    function WebSocketServer(config) {
        this.config = config;
    }
    /**
     * Listens for incoming connections.
     */
    WebSocketServer.prototype.listen = function () {
        this.webSocket = io();
        this.webSocket.on("connection", function (socket) {
            console.log("[WEBSOCKET-SERVER] Client '" + socket.client.id + "' connected ...");
        });
        this.webSocket.listen(this.config.port);
        console.log("[WEBSOCKET-SERVER] Listening on port: " + this.config.port);
    };
    /**
     * Updates all web clients witht the new weight.
     *
     * @param {string} data Updated weight (as string).
     */
    WebSocketServer.prototype.updateClients = function (data) {
        console.log("[WEBSOCKET-SERVER] Updating web clients now ...");
        this.webSocket.sockets.emit("weightUpdate", data);
    };
    return WebSocketServer;
}());
exports.WebSocketServer = WebSocketServer;
//# sourceMappingURL=WebsocketServer.js.map