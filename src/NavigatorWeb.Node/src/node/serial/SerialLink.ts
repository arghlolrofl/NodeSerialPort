import * as EventEmitter from "eventemitter3";

import * as SerialPort from "serialport";
import * as fs from "fs";
import * as path from "path";

import { ICanLog } from "./../interfaces/ICanLog";
import { Messages } from "./../config/Messages";
import { Heartbeat } from "./Heartbeat";
import { EventNames } from "./../config/EventNames";

/**
 * Manages the communication with a serial port.
 */
export class SerialLink {
    //#region Private Members

    private readBufferSize: number = 65536;
    private portName: string;
    private serialPort: SerialPort;
    private logger: ICanLog;
    private heartbeat: Heartbeat;
    private isConnectedToDevice: boolean = false;
    private events: EventEmitter3.EventEmitter = new EventEmitter();

    //#endregion

    //#region Properties

    /**
     * Class' event emitter.
     */
    public get Events(): EventEmitter3.EventEmitter { return this.events; }
    /**
     * Getter for the device connection status
     */
    public get IsConnectedToDevice(): boolean { return this.isConnectedToDevice; }
    /**
     * Setter for the device connection status
     */
    public set IsConnectedToDevice(val: boolean) {
        if (this.isConnectedToDevice != val) {
            this.logger.log("Device connection status changed: " + val);
            this.isConnectedToDevice = val;
            this.events.emit(EventNames.SerialLink.DEVICE_CONNECTION_STATUS_CHANGED, this.isConnectedToDevice);

            if (this.isConnectedToDevice === true) {
                this.heartbeat.start();
            } else {
                this.heartbeat.stop();
            }
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
        this.portName = portName;

        this.initializeSerialPort(baudRate, bufferSize);
        this.initializeHeartbeat(heartbeatInterval);
    }

    /**
     * Initializes the serial port connection
     *
     * @param baudRate Desired baudrate for serial connection
     * @param bufferSize Desired buffer size for incoming data
     */
    private initializeSerialPort(baudRate: number, bufferSize: number) {
        this.logger.log("Creating serial link to port '" + this.portName + "' with baud rate: " + baudRate);

        let buffSize = bufferSize || this.readBufferSize;
        this.logger.info("SerialLink read buffer size: " + buffSize);

        this.serialPort = new SerialPort(this.portName, {
            baudRate: baudRate,
            parity: "odd",
            bufferSize: buffSize,
            autoOpen: false
        });
    }

    /**
     * Initializes the heartbeat instance.
     *
     * @param heartbeatInterval Interval in ms when the heartbeat will raise the elapsed event
     */
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
        this.IsConnectedToDevice = false;

        let buffer = new Buffer(Messages.CONNECT);

        this.logger.log("Writing to serial port: connect");
        this.logger.dump(buffer);
        try {
            this.serialPort.write(buffer);
            // we don't know yet, if the connection has been established
            // successfully. therefore we will check that later.
            setTimeout(this.checkDeviceConnection.bind(this), 1000);
        } catch (e) {
            this.logger.error(<Error>e);
        }
    }

    /**
     * Tries to shutdown a connection to the device by sending
     * a 'DICONNECT'-message.
     */
    public DisconnectFromDevice(): void {
        let buffer = new Buffer(Messages.DISCONNECT);

        this.logger.log("Writing to serial port: disconnect");
        this.logger.dump(buffer);
        try {
            this.IsConnectedToDevice = false;
            this.serialPort.write(buffer);
        } catch (e) {
            this.logger.error(<Error>e);
        }
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
    public FetchPortInfo(): void {
        SerialPort.list((err, ports) => {
            ports.forEach((port) => {
                if (port.comName === this.portName) {
                    this.logger.log("--- PORT [" + port.comName + "] ---");
                    this.logger.log("    " + port.manufacturer);
                    this.logger.log("    " + port.pnpId);
                }
            });
        });
    }

    private checkDeviceConnection(): void {
        if (!this.IsConnectedToDevice) {
            this.Events.emit(EventNames.SerialLink.CONNECTION_ERROR_OCCURED, new Error("Device is not responding!"));
            this.Events.emit(EventNames.SerialLink.DEVICE_CONNECTION_STATUS_CHANGED, false);            
        }
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

        this.FetchPortInfo();

        this.logger.log("Serial port opened and callbacks registered ...");
    }

    /**
     * Called, when data has been received over the serial
     * connection.
     *
     * @param data Received data as NodeBuffer
     */
    private serialPort_OnDataReceived(data: Buffer) {
        this.events.emit(EventNames.SerialLink.BUFFER_RECEIVED, data);
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

    //#endregion
}