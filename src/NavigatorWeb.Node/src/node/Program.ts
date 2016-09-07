/// <reference path="../../typings/index.d.ts" />

import * as express from "express";
import * as fs from "fs";
import * as path from "path";
import * as morgan from "morgan";

import { Environment } from "./Environment";
import { RouteManager } from "./config/RouteManager";
import { WebSocketClient } from "./websockets/WebsocketClient";
import { WebSocketServer } from "./websockets/WebsocketServer";
import { SerialLink } from "./serial/SerialLink";
import { Logger } from "./Logger";
import { ICanLog } from "./interfaces/ICanLog";
import { Configuration } from "./config/Configuration";

/**
 * Wrapper for centralized initialization and configuration
 * of the express application (including the web server),
 * web socket client and web socket server.
 */
export class Program {
    //#region Private Members

    private express: express.Application;
    private logger: ICanLog;

    private wsClient: WebSocketClient;
    private wsServer: WebSocketServer;
    private serialLink: SerialLink;

    //#endregion

    //#region Static Members

    private static rootPath: string;
    /**
     * The root path of the project
     */
    public static get RootPath(): string { return Program.rootPath; }

    private static environment: Environment;
    /**
     * The environment of the node.js application.
     */
    public static get Environment(): Environment { return Program.environment; }

    //#endregion


    //#region Initialization

    /**
     * Creates a new instance of the Program class.
     * 
     * @param rootPath The root path of the node project
     */
    constructor(rootPath: string) {
        this.logger = new Logger(Program.Environment);

        Program.rootPath = rootPath;
        this.logger.log("Root path has been set to: " + Program.rootPath);
    }

    /**
     * Bootstraps the application by initializing and
     * configuring all components/connections.
     */
    public bootstrap(): express.Application {
        this.logger.log("Bootstrapping Node Express application ...");

        this.initializeEnvironment();

        // this.testSerialLink();

        // this.app = express();

        // this.configureEnvironment(Environment.DEBUG);
        // this.configureRoutes();

        // this.initializeWebSocketClient();
        // this.initializeWebSocketServer();

        return this.express;
    }

    //#endregion


    private testSerialLink(): void {
        this.serialLink = new SerialLink(this.logger, "COM7", 115200);

        this.serialLink.Open();
        setTimeout(this.serialLink.ConnectToDevice.bind(this.serialLink), 1000);
        setTimeout(this.testLink.bind(this), 5000);
        setTimeout(this.serialLink.DisconnectFromDevice.bind(this.serialLink), 7000);
        setTimeout(this.serialLink.Close.bind(this.serialLink), 10000);
    }

    private testLink() {
        this.logger.log("LAST MESSAGE RECEIVED:");
    }

    //#region Helpers

    /**
     * Initializes the node application with the environment that
     * has been set in the environment variable 'NODE_ENV'.
     * Defaults to 'DEBUG'.
     */
    private initializeEnvironment() {
        let environment: string = process.env.NODE_ENV || "DEBUG";

        switch (environment) {
            case "DEBUG":
                Program.Environment = Environment.DEBUG;
                break;
            case "STAGING":
                Program.Environment = Environment.STAGING;
                break;
            case "RELEASE":
                Program.Environment = Environment.RELEASE;
                break;
            case "PRODUCTION":
                Program.Environment = Environment.PRODUCTION;
                break;
            default:
                throw new Error("Invalid environment for node detected: " + environment);
        }

        this.logger.log("Environment has been set to: " + environment);
    }

    /**
     * Initializes the web socket client connection.
     */
    private initializeWebSocketClient(): void {
        this.wsClient = new WebSocketClient(Configuration.WebSocketClient.Url);
        this.wsClient.messageReceived$.subscribe(this.webSocketClient_OnMessageReceived.bind(this));
        this.wsClient.connect();
    }

    /**
     * Initializes the web socket server and puts it into listening state.
     */
    private initializeWebSocketServer(): void {
        this.wsServer = new WebSocketServer(Configuration.WebSocketServer.Port);
        this.wsServer.listen();
    }

    /**
     * Initializes the web server with a specific port that it will
     * listen on.
     */
    private initializeWebServer(): void {
        this.express.set("port", Configuration.WebServer.Port);
        this.logger.log("Web Server is using port: " + this.express.get("port"));

        // uncomment the following 2 lines to log to a file 
        // (remember to comment in the line below then)
        //
        // let accessLogStream = fs.createWriteStream("logs/access.log", { flags: "a" });
        // this.app.use(morgan("    :status    :method    :url", { stream: accessLogStream }));
        this.express.use(morgan("    :status    :method    :url"));

        this.logger.log("Initializing request logger ...");
    }

    /**
     * Registers static and API routes.
     */
    private registerRoutes(): void {
        new RouteManager(this.express, this.logger, Program.RootPath)
            .ApplyRoutes();
    }

    //#endregion

    //#region Callbacks

    /**
     * Callback, when data on the web socket client has been received.
     *
     * @param data Received message
     */
    private webSocketClient_OnMessageReceived(data: string): void {
        this.wsServer.updateClients(data);
    }

    //#endregion
}