/// <reference path="../../typings/index.d.ts" />

import * as express from "express";
import * as fs from "fs";
import * as path from "path";
import * as morgan from "morgan";

import { Environment } from "./Environment";
import { NodeExpressRouter } from "./NodeExpressRouter";
import { WebSocketClient } from "./websockets/WebsocketClient";
import { WebSocketServer } from "./websockets/WebsocketServer";
import { SerialLink } from "./serial/SerialLink";
import { Logger } from "./Logger";

/**
 * Class responsible for bootstrapping the application.
 */
export class NodeExpressApplication {
    private app: express.Application;
    private logger: Logger;
    private rootPath: string;
    private config: any;

    private wsClient: WebSocketClient;
    private wsServer: WebSocketServer;
    private serialLink: SerialLink;

    public environment: Environment;

    constructor(rootPath: string) {
        this.logger = new Logger(Environment.DEBUG);
        this.rootPath = rootPath;
        this.logger.log("Root path has been set to: " + this.rootPath);
    }

    public bootstrap(): express.Application {
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
    }

    private parseConfig() {
        let cfgPath = path.join(this.rootPath, "config/NodeExpressConfiguration.json");

        this.logger.log("Trying to parse: " + cfgPath);

        let jsonText: string = fs.readFileSync(cfgPath, "utf8");
        let jsonObject = JSON.parse(jsonText);

        this.logger.dump(jsonObject);

        return jsonObject;
    }

    private testSerialLink(): void {
        this.serialLink = new SerialLink("COM7", 115200, this.logger);

        this.serialLink.Open();
        setTimeout(this.serialLink.ConnectToDevice.bind(this.serialLink), 1000);
        setTimeout(this.testLink.bind(this), 5000);
        setTimeout(this.serialLink.DisconnectFromDevice.bind(this.serialLink), 7000);
        setTimeout(this.serialLink.Close.bind(this.serialLink), 10000);
    }

    private testLink() {
        this.logger.log("LAST MESSAGE RECEIVED:");
        this.logger.dump(this.serialLink.GetLastResponse());
    }

    private initializeWebSocketClient(config: any): void {
        this.wsClient = new WebSocketClient(config);
        this.wsClient.messageReceived$.subscribe(this.webSocketClient_OnMessageReceived.bind(this));
        this.wsClient.connect();
    }

    private initializeWebSocketServer(config: any): void {
        this.wsServer = new WebSocketServer(config);
        this.wsServer.listen();
    }

    private webSocketClient_OnMessageReceived(data: string): void {
        this.wsServer.updateClients(data);
    }

    private configureEnvironment(env: Environment): void {
        this.app.set("env", Environment[env]);
        this.logger.log("Initialized environment for: " + this.app.get("env"));
    }
    
    private configureRoutes(): void {
        let router = new NodeExpressRouter(this.app, this.logger);
        router.ApplyRoutes();
    }

    private initializeRequestLogger(): void {
        // create a write stream (in append mode) for request logging with morgan
        this.logger.log("Initializing request logger ...");

        let accessLogStream = fs.createWriteStream("logs/access.log", { flags: "a" });
        // this.app.use(morgan("    :status    :method    :url", { stream: accessLogStream }));
        this.app.use(morgan("    :status    :method    :url"));
    }
}