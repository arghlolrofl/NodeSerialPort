import * as EventEmitter from "eventemitter3";

import * as SerialPort from "serialport";
import * as fs from "fs";
import * as path from "path";

import { ICanLog } from "./../interfaces/ICanLog";
import { Messages } from "./../config/Messages";
import { MessageAggregator } from "./MessageAggregator";
import { Heartbeat } from "./Heartbeat";
import { EventNames } from "./../config/EventNames";

/**
 * Manages the communication with a serial port.
 */
export class SerialLink {
    //#region Private Members

    private readBufferSize: number = 65536;
    private serialPort: SerialPort;
    private logger: ICanLog;
    private messageAggregator: MessageAggregator;
    private heartbeat: Heartbeat;
    private isConnectedToDevice: boolean = false;

    //#endregion

    //#region Events
    
    private events: EventEmitter3.EventEmitter = new EventEmitter();
    public get Events(): EventEmitter3.EventEmitter {
        return this.events;
    }

    //#endregion

    //#region Properties
    
    /**
     * Returns the device connection status
     */
    public get IsConnectedToDevice(): boolean { return this.isConnectedToDevice; }
    /**
     * Sets the device connection status
     */
    public set IsConnectedToDevice(val: boolean) {
        if (this.isConnectedToDevice != val) {
            this.logger.log("Device connection status changed: " + val);
            this.isConnectedToDevice = val;
            this.events.emit(EventNames.SerialLink.DEVICE_CONNECTION_STATUS_CHANGED, this.isConnectedToDevice);
        }

    }

    //#endregion

    //#region Initialization

    /**
     * Creates a new instance of the SerialLink class.
     *
     * @param logger Logger instance uses by the main application
     * @param portName Name of the serial port, e.g.: 'COM7'
     * @param baudRate BaudRate for the serial port connection
     * @param bufferSize Maximum size of the read buffer
     */
    constructor(
        logger: ICanLog,
        portName: string,
        baudRate: number,
        heartbeatInterval: number,
        bufferSize?: number
    ) {
        this.logger = logger;
        this.logger.log("Creating SerialLink ...");
        
        this.initializeSerialPort(portName, baudRate, bufferSize);
        this.initializeHeartbeat(heartbeatInterval);
        this.initializeMessageAggregator();
    }

    private initializeSerialPort(portName: string, baudRate: number, bufferSize: number) {
        this.logger.log("Creating serial link to port '" + portName + "' with baud rate: " + baudRate);

        let buffSize = bufferSize || this.readBufferSize;
        this.serialPort = new SerialPort(portName, {
            baudRate: baudRate,
            parity: "odd",
            bufferSize: buffSize,
            autoOpen: false
        });
        this.logger.info("SerialLink read buffer size: " + buffSize);
    }

    private initializeHeartbeat(heartbeatInterval: number) {
        this.heartbeat = new Heartbeat(heartbeatInterval);
        this.heartbeat.Events.on(
            EventNames.Heartbeat.ELAPSED,
            () => {
                this.heartbeat_OnIntervalElapsed();
            }
        );
        this.logger.info("SerialLink heartbeat interval: " + heartbeatInterval + " ms");
    }

    private initializeMessageAggregator() {
        this.messageAggregator = new MessageAggregator();
        this.messageAggregator.Events.on(
            EventNames.MessageAggregator.BUFFER_ASSEMBLING_COMPLETED,
            (data: Buffer) => {
                this.messageAggregator_OnMessageCompleted(data);
            }
        );
    }

    //#endregion

    //#region Public Methods

    /**
     * Opens the serial port connection and sets up a callback,
     * if it was successfull.
     */
    public Open(): void {
        this.serialPort.open(this.serialPort_OnOpen.bind(this));
    }

    /**
     * Tries to establish a connection to the device by sending
     * a 'CONNECT'-message.
     */
    public ConnectToDevice(): void {        
        let buffer = new Buffer(Messages.CONNECT);

        this.logger.log("Writing to serial port: connect");
        this.logger.dump(buffer);

        this.IsConnectedToDevice = true;
        this.heartbeat.start();
        this.serialPort.write(buffer);
    }

    /**
     * Tries to shutdown a connection to the device by sending
     * a 'DICONNECT'-message.
     */
    public DisconnectFromDevice(): void {
        this.heartbeat.stop();

        let buffer = new Buffer(Messages.DISCONNECT);
        this.IsConnectedToDevice = false;

        this.logger.log("Writing to serial port: disconnect");
        this.logger.dump(buffer);
        this.serialPort.write(buffer);
    }

    /**
     * Closes the the serial port connection. After closing,
     * no more reading or writing to the serial port is possible.
     */
    public Close(): void {
        this.serialPort.close();

        this.logger.log("SerialLink closed ...");
    }

    /**
     * Lists all available serial ports. Remember that a device
     * must be connected to the host to be listed here.
     */
    public ListAvailablePorts(): void {
        this.logger.log("Listing available ports ...");

        SerialPort.list(function (err, ports) {
            ports.forEach(function (port) {
                this.logger.log("    --- PORT ---");
                this.logger.log("        " + port.comName);
                this.logger.log("        " + port.pnpId);
                this.logger.log("        " + port.manufacturer);
            });
        });
    }

    //#endregion

    //#region Callbacks

    /**
     * Called, when the serial port connection has been opened successfully.
     * Also sets up all relevant callbacks for serial communication.
     */
    private serialPort_OnOpen(): void {
        this.serialPort.on("data", this.serialPort_OnDataReceived.bind(this));
        this.serialPort.on("close", this.serialPort_OnClosed.bind(this));
        this.serialPort.on("disconnect", this.serialPort_OnDisconnected.bind(this));
        this.serialPort.on("error", this.serialPort_OnError.bind(this));

        this.logger.log("Serial port opened and callbacks registered ...");
    }

    /**
     * Called, when data has been received over the serial
     * connection.
     *
     * @param data Received data as NodeBuffer
     */
    private serialPort_OnDataReceived(data: Buffer) {
        this.IsConnectedToDevice = true;

        this.messageAggregator.PushBuffer(data);
    }

    /**
     * Callback is called with an error object. This will always
     * happen before a close event if a disconnection is detected.
     *
     * @param error Error object
     */
    private serialPort_OnDisconnected(error: any): void {
        this.IsConnectedToDevice = false;
        this.logger.log("SerialPort_OnDisconnected");
        if (typeof error !== 'undefined')
            this.logger.error(error);
    }

    /**
     * Callback is called with no arguments when the port is closed.
     * In the event of an error, an error event will be triggered
     */
    private serialPort_OnClosed(): void {
        this.IsConnectedToDevice = false;
        this.logger.log("SerialPort_OnClosed");
    }

    /**
     * Callback is called with an error object whenever there is an error.
     * 
     * @param error Error object
     */
    private serialPort_OnError(error: Error): void {
        this.logger.log("SerialPort_OnError");        
        this.logger.log(" > Serial Port Status: " + this.serialPort.isOpen());

        if (!this.serialPort.isOpen()) {
            this.heartbeat.stop();
            this.IsConnectedToDevice = false;
        }

        this.events.emit(EventNames.SerialLink.CONNECTION_ERROR_OCCURED, error);
    }

    /**
     * Called, when the heartbeat interval has elapsed.
     */
    private heartbeat_OnIntervalElapsed() {
        this.logger.log("SerialLink.heartbeat_OnIntervalElapsed");

        let buffer = new Buffer(Messages.HEARTBEAT);
        this.logger.dump(buffer);

        try {
            this.serialPort.write(buffer);
            this.IsConnectedToDevice = true;
        } catch (e) {
            this.logger.error((<Error>e));
            this.IsConnectedToDevice = false;
        }
    }

    /**
     * Callback is being called, when the message aggregator has
     * assembled a complete message buffer.
     *
     * @param data Complete message buffer
     */
    private messageAggregator_OnMessageCompleted(data: Buffer) {
        this.events.emit(EventNames.SerialLink.BUFFER_RECEIVED, data);
    }

    //#endregion
}