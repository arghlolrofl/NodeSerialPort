/// <reference path="../../typings/index.d.ts" />
"use strict";
var fs = require('fs');
var morgan = require('morgan');
var node_environment_1 = require('./node.environment');
var node_express_router_1 = require('./node.express.router');
var node_websocket_client_1 = require('./websockets/node.websocket.client');
var node_websocket_server_1 = require('./websockets/node.websocket.server');
var node_serial_link_1 = require('./serial/node.serial.link');
var NodeExpressApplication = (function () {
    function NodeExpressApplication(logger) {
        this.logger = logger;
    }
    NodeExpressApplication.prototype.Create = function () {
        //this.logger.info("Creating Node Express application ...");
        //this.InitializeSerialLink();
        //let cfg = new ConfigurationService();
        //this.app = express();
        //this.InitializeExpressLogger();
        //this.SetEnvironment();
        //this.ConfigureRoutes();
        //this.app.set('port', cfg.WebServerConfiguration.PORT);
        //this.InitializeWebSocketClient();
        //this.InitializeWebSocketServer();
        return this.app;
    };
    NodeExpressApplication.prototype.InitializeSerialLink = function () {
        this.serialLink = new node_serial_link_1.SerialLink("COM7", 115200);
        this.serialLink.Open();
        setTimeout(this.serialLink.ConnectToDevice.bind(this.serialLink), 1000);
        setTimeout(this.TestLink.bind(this), 5000);
        setTimeout(this.serialLink.DisconnectFromDevice.bind(this.serialLink), 7000);
        setTimeout(this.serialLink.Close.bind(this.serialLink), 10000);
    };
    NodeExpressApplication.prototype.TestLink = function () {
        console.log("LAST MESSAGE RECEIVED:");
        console.info(this.serialLink.GetLastResponse());
    };
    NodeExpressApplication.prototype.InitializeWebSocketClient = function () {
        this.wsClient = new node_websocket_client_1.NodeWebSocketClient();
        this.wsClient.messageReceived$.subscribe(this.WebSocketClient_OnMessageReceived.bind(this));
        this.wsClient.connect();
    };
    NodeExpressApplication.prototype.InitializeWebSocketServer = function () {
        this.wsServer = new node_websocket_server_1.NodeWebSocketServer();
        this.wsServer.listen();
    };
    NodeExpressApplication.prototype.WebSocketClient_OnMessageReceived = function (data) {
        this.wsServer.updateClients(data);
    };
    NodeExpressApplication.prototype.SetEnvironment = function () {
        this.app.set('env', node_environment_1.Environment[node_environment_1.Environment.DEBUG]);
        this.logger.info("Initialized environment for: " + this.app.get("env"));
    };
    NodeExpressApplication.prototype.ConfigureRoutes = function () {
        var router = new node_express_router_1.NodeExpressRouter(this.app, this.logger);
        router.ApplyRoutes();
    };
    NodeExpressApplication.prototype.InitializeExpressLogger = function () {
        // create a write stream (in append mode) for request logging with morgan
        this.logger.info("Initializing express logger ...");
        var accessLogStream = fs.createWriteStream('logs/access.log', { flags: 'a' });
        //this.app.use(morgan("    :status    :method    :url", { stream: accessLogStream }));
        this.app.use(morgan("    :status    :method    :url"));
    };
    return NodeExpressApplication;
}());
exports.NodeExpressApplication = NodeExpressApplication;
//# sourceMappingURL=node.express.application.js.map