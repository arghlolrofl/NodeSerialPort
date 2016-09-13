/// <reference path="../../typings/index.d.ts" />

import * as express from "express";
import * as fs from "fs";
import * as path from "path";
import * as morgan from "morgan";
import * as http from "http";


import { ICanLog } from "./interfaces/ICanLog";
import { IMessagePipeline } from "./interfaces/IMessagePipeline";

import { Environment } from "./enums/Environment";
import { RouteManager } from "./config/RouteManager";
import { WebSocketServer } from "./websocket/WebsocketServer";
import { SerialLink } from "./serial/SerialLink";
import { Logger } from "./logging/Logger";
import { Configuration } from "./config/Configuration";
import { EventNames } from "./config/EventNames";
import { ClientRequest } from "./../common/ClientRequest";
import { MessagePipeline } from "./MessagePipeline";
import { MessageAggregator } from "./serial/MessageAggregator";

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
    private wsServer: WebSocketServer<Buffer>;
    private serialLink: SerialLink;
    private messageAggregator: MessageAggregator;
    private connectedClientId: string;
    private messagePipeline: IMessagePipeline<Buffer>;

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
        this.initializeMessageAggregator();

        this.initializeWebServer();
        this.registerRoutes();

        // create the message pipeline at last step, so we can be sure
        // that 'input'- and 'output'-instances are initialized.
        this.messagePipeline = new MessagePipeline(this.messageAggregator, this.wsServer);

        this.logger.log("Bootstrapped application, starting web server ...");
        this.webServer = this.express.listen(this.express.get("port"), () => {
            console.log("Express server listening on port " + this.webServer.address().port);
        });
    }

    /**
     * Initializes the serial port connection to the device.
     */
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
                this.serialLink_OnDataReceived(data);
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
            (request: ClientRequest) => {
                this.webSocketServer_OnRequestReceived(request);
            }
        );
        this.wsServer.listen();
    }

    /**
     * Initializes the message aggregator and subscribes to its events.
     */
    private initializeMessageAggregator() {
        this.messageAggregator = new MessageAggregator();
        this.messageAggregator.Events.on(
            EventNames.MessageAggregator.BUFFER_ASSEMBLING_COMPLETED,
            (data: Buffer) => {
                this.messageAggregator_OnMessageCompleted(data);
            }
        );
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
    private webSocketServer_OnRequestReceived(request: ClientRequest): void {
        switch (request.request) {
            case "connect":
                if (this.serialLink.IsConnectedToDevice)
                    this.serialLink_OnError(new Error("Another client is already connected to the device!"));
                else {
                    this.serialLink.ConnectToDevice();
                    this.connectedClientId = request.clientId;
                    this.messagePipeline.setClientId(this.connectedClientId);
                }
                break;
            case "disconnect":
                this.serialLink.DisconnectFromDevice();
                this.connectedClientId = null;
                this.messagePipeline.setClientId(null);
                break;
            default:
                this.logger.log("Invalid request received: " + request);
                this.serialLink_OnError(new Error("Invalid request: " + request));
                break;
        }
    }

    /**
     * Callback for serial link errors
     *
     * @param error
     */
    private serialLink_OnError(error: Error) {
        this.logger.log("Informing client '" + this.connectedClientId + "' about error: " + error.message);
        this.wsServer.sendError(error, this.connectedClientId);
    }

    /**
     * Callback, when the device connection status changes
     *
     * @param isConnected
     */
    private serialLink_OnDeviceConnectionStatusChanged(isConnected: boolean) {
        this.wsServer.sendDeviceConnectionStatus(isConnected, this.connectedClientId);
    }

    /**
     * EventHandler when new data are being received via serial port.
     *
     * @param data Received buffer
     */
    private serialLink_OnDataReceived(data: Buffer): void {
        this.messagePipeline.takeInput(data);
    }

    /**
     * Callback is being called, when the message aggregator has
     * assembled a complete message buffer.
     *
     * @param data Complete message buffer
     */
    private messageAggregator_OnMessageCompleted(data: Buffer) {
        // When initiating a connection to the device, if all goes well,
        // we receive a lot of status messages. The first message received,
        // after triggering a connect should have the id 17 (ConfirmConnect).
        if (data[1] === 17) {
            // So, now we can assume, that we're connected to the device!
            this.serialLink.IsConnectedToDevice = true;
        }
    }

    //#endregion
}