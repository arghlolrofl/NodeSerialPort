/// <reference path="../../typings/index.d.ts" />

import * as express from 'express';
import * as fs from 'fs';
import * as morgan from 'morgan';

import { Environment } from './node.environment';
import { ConfigurationService } from './node.config';
import { NodeExpressRouter } from './node.express.router';
import { NodeWebSocketClient } from './websockets/node.websocket.client';
import { NodeWebSocketServer } from './websockets/node.websocket.server';
import { SerialLink } from './serial/node.serial.link';

export class NodeExpressApplication {
    private app: express.Application;
    private logger: any;
    private wsClient: NodeWebSocketClient;
    private wsServer: NodeWebSocketServer;
    private serialLink: SerialLink;

    public environment: Environment;

    constructor(logger: any) {
        this.logger = logger;
    }

    public Create(): express.Application {
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
    }

    private InitializeSerialLink(): void {
        this.serialLink = new SerialLink("COM7", 115200);
        
        this.serialLink.Open();
        setTimeout(this.serialLink.ConnectToDevice.bind(this.serialLink), 1000);
        setTimeout(this.TestLink.bind(this), 5000);
        setTimeout(this.serialLink.DisconnectFromDevice.bind(this.serialLink), 7000);
        setTimeout(this.serialLink.Close.bind(this.serialLink), 10000);
    }

    private TestLink() {
        console.log("LAST MESSAGE RECEIVED:");
        console.info(this.serialLink.GetLastResponse());
    }

    private InitializeWebSocketClient(): void {
        this.wsClient = new NodeWebSocketClient();
        this.wsClient.messageReceived$.subscribe(this.WebSocketClient_OnMessageReceived.bind(this));
        this.wsClient.connect();
    }

    private InitializeWebSocketServer(): void {
        this.wsServer = new NodeWebSocketServer();
        this.wsServer.listen();
    }

    private WebSocketClient_OnMessageReceived(data: string): void {
        this.wsServer.updateClients(data);
    }

    private SetEnvironment(): void {
        this.app.set('env', Environment[Environment.DEBUG]);
        this.logger.info("Initialized environment for: " + this.app.get("env"));
    }

    private ConfigureRoutes(): void {
        let router = new NodeExpressRouter(this.app, this.logger);
        router.ApplyRoutes();
    }

    private InitializeExpressLogger(): void {
        // create a write stream (in append mode) for request logging with morgan
        this.logger.info("Initializing express logger ...");

        var accessLogStream = fs.createWriteStream('logs/access.log', { flags: 'a' });
        //this.app.use(morgan("    :status    :method    :url", { stream: accessLogStream }));
        this.app.use(morgan("    :status    :method    :url"));
    }
}