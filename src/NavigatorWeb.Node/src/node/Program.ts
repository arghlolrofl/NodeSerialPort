/// <reference path="../../typings/index.d.ts" />

import * as express from "express";
import * as fs from "fs";
import * as path from "path";
import * as morgan from "morgan";
import * as http from "http";

import { Environment } from "./enums/Environment";
import { RouteManager } from "./config/RouteManager";
import { WebSocketClient } from "./websocket/WebsocketClient";
import { WebSocketServer } from "./websocket/WebsocketServer";
import { SerialLink } from "./serial/SerialLink";
import { Logger } from "./logging/Logger";
import { ICanLog } from "./interfaces/ICanLog";
import { Configuration } from "./config/Configuration";
import { EventNames } from "./config/EventNames";

/**
 * Wrapper for centralized initialization and configuration
 * of the express application (including the web server),
 * web socket client and web socket server.
 */
export class Program {
    private errorSubscription: any;

    //#region Private Members

    private express: express.Application;
    private logger: ICanLog;
    private webServer: http.Server;
    private wsClient: WebSocketClient;
    private wsServer: WebSocketServer;
    private serialLink: SerialLink;

    private IsDeviceConnected: boolean

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
        this.initializeEnvironment();

        this.logger = new Logger(Program.Environment);
        this.logger.log("Environment has been set to: " + Environment[Program.Environment]);

        Program.rootPath = rootPath;
        this.logger.log("Root path has been set to: " + Program.rootPath);
    }

    /**
     * Bootstraps the application by initializing and
     * configuring all components/connections.
     */
    public bootstrap(): void {
        this.logger.log("Bootstrapping Node Express application ...");

        this.express = express();
        
        this.initializeWebSocketServer();
        this.initializeSerialLink();

        this.initializeWebServer();
        this.registerRoutes();

        this.logger.log("Bootstrapped application, starting web server ...");
        this.webServer = this.express.listen(this.express.get("port"), () => {
            console.log("Express server listening on port " + this.webServer.address().port);
        });
    }

    //#endregion

        
    //#region Helpers

    private initializeSerialLink(): void {
        this.serialLink = new SerialLink(
            this.logger,
            "COM7",
            115200,
            Configuration.Serial.HeartbeatInterval
        );

        this.serialLink.Events.on(
            EventNames.SerialLink.BUFFER_RECEIVED,
            (data: Buffer) => {
                this.serialLink_OnBufferReceivedCompletely(data);
            }
        );
        this.serialLink.Events.on(
            EventNames.SerialLink.DEVICE_CONNECTION_STATUS_CHANGED,
            (val: boolean) => {
                this.serialLink_OnDeviceConnectionStatusChanged(val);
            }
        );
        this.serialLink.Events.on(
            EventNames.SerialLink.CONNECTION_ERROR_OCCURED,
            (err: Error) => {
                this.serialLink_OnError(err);
            }
        );

        this.logger.log("Opening serial connection ...");
        this.serialLink.Open();
    }

    /**
     * Initializes the node application with the environment that
     * has been set in the environment variable 'NODE_ENV'.
     * Defaults to 'DEBUG'.
     */
    private initializeEnvironment() {
        let environment: string = process.env.NODE_ENV || "DEBUG";

        switch (environment) {
            case "DEBUG":
                Program.environment = Environment.DEBUG;
                break;
            case "STAGING":
                Program.environment = Environment.STAGING;
                break;
            case "RELEASE":
                Program.environment = Environment.RELEASE;
                break;
            case "PRODUCTION":
                Program.environment = Environment.PRODUCTION;
                break;
            default:
                throw new Error("Invalid environment for node detected: " + environment);
        }
    }

    /**
     * Initializes the web socket server and puts it into listening state.
     */
    private initializeWebSocketServer(): void {
        this.wsServer = new WebSocketServer(Configuration.WebSocketServer.Port);
        this.wsServer.Events.on(
            EventNames.WebSocketServer.CLIENT_REQUEST_RECEIVED,
            (request: string) => {
                this.webSocketServer_OnRequestReceived(request);
            }
        );
        this.wsServer.listen();
    }

    /**
     * Initializes the web server with a specific port that it will
     * listen on.
     */
    private initializeWebServer(): void {
        this.express.set("port", Configuration.WebServer.Port);

        this.logger.log("Initializing request logger ...");
        // uncomment the following 2 lines to log to a file 
        // (remember to comment in the line below then)
        //
        // let accessLogStream = fs.createWriteStream("logs/access.log", { flags: "a" });
        // this.app.use(morgan("    :status    :method    :url", { stream: accessLogStream }));
        this.express.use(morgan("    :status    :method    :url"));

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
     * Callback for received client requests
     *
     * @param message Request string
     */
    private webSocketServer_OnRequestReceived(request: string): void {
        switch (request) {
            case "connect":
                this.serialLink.ConnectToDevice();
                break;
            case "disconnect":
                this.serialLink.DisconnectFromDevice();
                break;
            default:
                this.logger.log("Invalid request received: " + request);
                this.serialLink_OnError(new Error("Invalid request: " + request));
                break;
        }
    }

    private serialLink_OnBufferReceivedCompletely(data: Buffer): void {        
        this.wsServer.sendBuffer(data);
    }

    private serialLink_OnError(error: Error) {
        this.logger.log("Informing client about error ...");
        this.wsServer.sendError(error);
    }

    private serialLink_OnDeviceConnectionStatusChanged(isConnected: boolean) {        
        this.wsServer.sendDeviceConnectionStatus(isConnected);
    }

    //#endregion
}