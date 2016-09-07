import * as SerialPort from "serialport";
import * as fs from "fs";
import * as path from "path";

import { ICanLog } from "./../interfaces/ICanLog";
import { Messages } from "./../config/Messages";

/**
 * Manages the communication with a serial port.
 */
export class SerialLink {
    //#region Private Members

    private readBufferSize: number = 65536;
    private serialPort: SerialPort;
    private logger: ICanLog;

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
        bufferSize?: number
    ) {
        this.logger = logger;
        this.logger.log("Creating serial link to port '" + portName + "' with baud rate: " + baudRate);

        let buffSize = bufferSize || this.readBufferSize;
        this.serialPort = new SerialPort(portName, {
            baudRate: baudRate,
            parity: "odd",
            bufferSize: buffSize,
            autoOpen: false
        });

        this.logger.info("SerialLink read buffer size: " + buffSize);
        this.logger.log("SerialLink initialized ...");
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
        this.serialPort.write(buffer);

        this.logger.log("Written to serial port: connect");
        this.logger.dump(buffer);
    }

    /**
     * Tries to shutdown a connection to the device by sending
     * a 'DICONNECT'-message.
     */
    public DisconnectFromDevice(): void {
        let buffer = new Buffer(Messages.DISCONNECT);
        this.serialPort.write(buffer);

        this.logger.log("Written to serial port: disconnect");
        this.logger.dump(buffer);
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

        this.logger.log("Registered Callbacks!");
    }

    /**
     * Called, when data has been received over the serial
     * connection.
     *
     * @param data Received data as NodeBuffer
     */
    private serialPort_OnDataReceived(data: Buffer) {
        let messageId = data.readUInt16BE(0);
        let messageSize = data.readUInt32BE(2);
        let payload = data.slice(6);

        this.logger.log("");
        this.logger.log(" >      Id: " + messageId);
        this.logger.log(" >    Size: " + messageSize);
        this.logger.log(" > Buffer: (" + data.byteLength + " Bytes)");
        this.logger.dump(data);
        this.logger.log(" > Payload: (" + payload.byteLength + " Bytes)");
        this.logger.dump(payload);
    }

    /**
     * Callback is called with an error object. This will always
     * happen before a close event if a disconnection is detected.
     *
     * @param error Error object
     */
    private serialPort_OnDisconnected(error: any): void {
        this.logger.log("SerialPort_OnDisconnected");
        this.logger.error(error);
    }

    /**
     * Callback is called with no arguments when the port is closed.
     * In the event of an error, an error event will be triggered
     */
    private serialPort_OnClosed(): void {
        this.logger.log("SerialPort_OnClosed");
    }

    /**
     * Callback is called with an error object whenever there is an error.
     * 
     * @param error Error object
     */
    private serialPort_OnError(error: any): void {
        this.logger.log("SerialPort_OnError");
        this.logger.error(error);
    }

    //#endregion
}