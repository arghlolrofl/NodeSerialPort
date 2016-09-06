/// <reference path="../../typings/index.d.ts" />
"use strict";
var fs = require("fs");
var path = require("path");
var morgan = require("morgan");
var Environment_1 = require("./Environment");
var NodeExpressRouter_1 = require("./NodeExpressRouter");
var WebsocketClient_1 = require("./websockets/WebsocketClient");
var WebsocketServer_1 = require("./websockets/WebsocketServer");
var SerialLink_1 = require("./serial/SerialLink");
var Logger_1 = require("./Logger");
/**
 * Class responsible for bootstrapping the application.
 */
var NodeExpressApplication = (function () {
    function NodeExpressApplication(rootPath) {
        this.logger = new Logger_1.Logger(Environment_1.Environment.DEBUG);
        this.rootPath = rootPath;
        this.logger.log("Root path has been set to: " + this.rootPath);
    }
    NodeExpressApplication.prototype.bootstrap = function () {
        this.logger.log("Bootstrapping Node Express application ...");
        this.parseConfig();
        //this.testSerialLink();
        //this.app = express();
        //this.initializeRequestLogger();
        //this.configureEnvironment(Environment.DEBUG);
        //this.configureRoutes();
        this.app.set("port", this.config.webserver.port);
        //this.initializeWebSocketClient(this.config.websocket.client);
        //this.initializeWebSocketServer(this.config.websocket.server);
        return this.app;
    };
    NodeExpressApplication.prototype.parseConfig = function () {
        var cfgPath = path.join(this.rootPath, "config/NodeExpressConfiguration.json");
        this.logger.log("Trying to parse: " + cfgPath);
        var jsonText = fs.readFileSync(cfgPath, "utf8");
        var jsonObject = JSON.parse(jsonText);
        this.logger.dump(jsonObject);
        return jsonObject;
    };
    NodeExpressApplication.prototype.testSerialLink = function () {
        this.serialLink = new SerialLink_1.SerialLink("COM7", 115200, this.logger);
        this.serialLink.Open();
        setTimeout(this.serialLink.ConnectToDevice.bind(this.serialLink), 1000);
        setTimeout(this.testLink.bind(this), 5000);
        setTimeout(this.serialLink.DisconnectFromDevice.bind(this.serialLink), 7000);
        setTimeout(this.serialLink.Close.bind(this.serialLink), 10000);
    };
    NodeExpressApplication.prototype.testLink = function () {
        this.logger.log("LAST MESSAGE RECEIVED:");
        this.logger.dump(this.serialLink.GetLastResponse());
    };
    NodeExpressApplication.prototype.initializeWebSocketClient = function (config) {
        this.wsClient = new WebsocketClient_1.WebSocketClient(config);
        this.wsClient.messageReceived$.subscribe(this.webSocketClient_OnMessageReceived.bind(this));
        this.wsClient.connect();
    };
    NodeExpressApplication.prototype.initializeWebSocketServer = function (config) {
        this.wsServer = new WebsocketServer_1.WebSocketServer(config);
        this.wsServer.listen();
    };
    NodeExpressApplication.prototype.webSocketClient_OnMessageReceived = function (data) {
        this.wsServer.updateClients(data);
    };
    NodeExpressApplication.prototype.configureEnvironment = function (env) {
        this.app.set("env", Environment_1.Environment[env]);
        this.logger.log("Initialized environment for: " + this.app.get("env"));
    };
    NodeExpressApplication.prototype.configureRoutes = function () {
        var router = new NodeExpressRouter_1.NodeExpressRouter(this.app, this.logger);
        router.ApplyRoutes();
    };
    NodeExpressApplication.prototype.initializeRequestLogger = function () {
        // create a write stream (in append mode) for request logging with morgan
        this.logger.log("Initializing request logger ...");
        var accessLogStream = fs.createWriteStream("logs/access.log", { flags: "a" });
        // this.app.use(morgan("    :status    :method    :url", { stream: accessLogStream }));
        this.app.use(morgan("    :status    :method    :url"));
    };
    return NodeExpressApplication;
}());
exports.NodeExpressApplication = NodeExpressApplication;
//# sourceMappingURL=NodeExpressApplication.js.map