/// <reference path="../../../typings/globals/socket.io/index.d.ts" />
"use strict";
var io = require('socket.io');
var node_config_1 = require('../node.config');
var NodeWebSocketServer = (function () {
    /**
     * Instantiates a new instance of a WebSocket server.
     */
    function NodeWebSocketServer() {
        this.config = new node_config_1.ConfigurationService().WebSocketServerConfiguration;
    }
    /**
     * Listens for incoming connections.
     */
    NodeWebSocketServer.prototype.listen = function () {
        this.webSocket = io();
        this.webSocket.on('connection', function (socket) {
            console.log("[WEBSOCKET-SERVER] Client '" + socket.client.id + "' connected ...");
        });
        this.webSocket.listen(this.config.PORT);
        console.log("[WEBSOCKET-SERVER] Listening on port: " + this.config.PORT);
    };
    /**
     * Updates all web clients witht the new weight.
     *
     * @param {string} data Updated weight (as string).
     */
    NodeWebSocketServer.prototype.updateClients = function (data) {
        console.log("[WEBSOCKET-SERVER] Updating web clients now ...");
        this.webSocket.sockets.emit("weightUpdate", data);
    };
    return NodeWebSocketServer;
}());
exports.NodeWebSocketServer = NodeWebSocketServer;
//# sourceMappingURL=node.websocket.server.js.map