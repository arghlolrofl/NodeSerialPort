import * as SerialPort from "serialport";
import * as fs from "fs";
import * as path from "path";

import { Logger } from "./../Logger";

export class SerialLink {
    private READ_BUFFER_SIZE: number = 65536;

    private logger: Logger;
    private serialPort: SerialPort;
    private m_LastMessageReceived: any;
    private m_Messages: any;

    constructor(portName: string, baudRate: number, logger: Logger) {
        this.logger = logger;

        this.logger.log("Creating serial link to port '" + portName + "' with baud rate: " + baudRate);

        let jsonPath = path.join(__dirname, "../../common/messages.json");
        let jsonText: string = fs.readFileSync(jsonPath, "utf8");
        let jsonObject = JSON.parse(jsonText);

        this.m_Messages = jsonObject;

        this.serialPort = new SerialPort(portName, {
            baudRate: baudRate,
            parity: "odd",
            bufferSize: this.READ_BUFFER_SIZE,
            autoOpen: false
        });

        this.logger.log("SerialLink initialized ...");
    }

    public Open(): void {
        this.serialPort.open(this.SerialPort_OnOpen.bind(this));
    }

    public ConnectToDevice(): void {
        let buffer = new Buffer(this.m_Messages["connect"]);
        this.serialPort.write(buffer);

        this.logger.log("Written to serial port: connect");
        this.logger.dump(buffer);
    }

    public GetLastResponse(): any {
        return this.m_LastMessageReceived;
    }

    public DisconnectFromDevice(): void {
        let buffer = new Buffer(this.m_Messages["disconnect"]);
        this.serialPort.write(buffer);

        this.logger.log("Written to serial port: disconnect");
        this.logger.dump(buffer);
    }

    public Close(): void {
        this.serialPort.close();

        this.logger.log("SerialLink closed ...");
    }

    private SerialPort_OnOpen(): void {
        this.serialPort.on("data", this.SerialPort_OnDataReceived.bind(this));
        this.serialPort.on("close", this.SerialPort_OnClosed.bind(this));
        this.serialPort.on("disconnect", this.SerialPort_OnDisconnected.bind(this));
        this.serialPort.on("error", this.SerialPort_OnError.bind(this));

        this.logger.log("Registered Callbacks!");
    }

    private SerialPort_OnDataReceived(data: Buffer) {
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

        this.m_LastMessageReceived = data;
    }

    private SerialPort_OnClosed(): void {
        this.logger.log("SerialPort_OnClosed");
    }

    private SerialPort_OnDisconnected(error: any): void {
        this.logger.log("SerialPort_OnDisconnected");
        this.logger.error(error);
    }

    private SerialPort_OnError(error: any): void {
        this.logger.log("SerialPort_OnError");
        this.logger.error(error);
    }

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
}