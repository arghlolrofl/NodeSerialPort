/// <reference path="../../typings/index.d.ts" />

import * as express from 'express';
import * as fs from 'fs';
import * as morgan from 'morgan';

import { Environment } from './node.environment';
import { ConfigurationService } from './node.config';
import { NodeExpressRouter } from './node.express.router';
import { NodeWebSocketClient } from './websockets/node.websocket.client';
import { NodeWebSocketServer } from './websockets/node.websocket.server';

export class NodeExpressApplication {
    private app: express.Application;
    private logger: any;
    private wsClient: NodeWebSocketClient;
    private wsServer: NodeWebSocketServer;

    public environment: Environment;

    constructor(logger: any) {
        this.logger = logger;
        this.logger.info("Instantiating NodeExpressApplication ...");
    }

    public Create(): express.Application {
        this.logger.info("Creating Node Express application ...");

        let cfg = new ConfigurationService();
        
        this.app = express();

        this.InitializeExpressLogger();
        this.SetEnvironment();
        this.ConfigureRoutes();

        this.app.set('port', cfg.WebServerConfiguration.PORT);

        this.InitializeWebSocketClient();
        this.InitializeWebSocketServer();
        
        return this.app;
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