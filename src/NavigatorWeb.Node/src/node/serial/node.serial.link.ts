import * as SerialPort from 'serialport';
import * as fs from 'fs';
import * as path from 'path';

export class SerialLink {
    private READ_BUFFER_SIZE: number = 65536;

    private m_SerialPort: SerialPort;
    private m_Messages: any;
    private m_LastMessageReceived: any;


    constructor(portName: string, baudRate: number) {
        console.log("Creating serial link to port '" + portName + "' with baud rate: " + baudRate);

        let jsonPath = path.join(__dirname, '../../src/common/messages.json');
        let jsonText: string = fs.readFileSync(jsonPath, 'utf8');
        let jsonObject = JSON.parse(jsonText);

        this.m_Messages = jsonObject;

        this.m_SerialPort = new SerialPort(portName, {
            baudRate: baudRate,
            parity: "odd",
            bufferSize: this.READ_BUFFER_SIZE,
            autoOpen: false
        });

        console.log("SerialLink initialized ...");
    }

    public Open(): void {
        this.m_SerialPort.open(this.SerialPort_OnOpen.bind(this));
    }

    public ConnectToDevice(): void {
        let buffer = new Buffer(this.m_Messages["connect"]);
        this.m_SerialPort.write(buffer);

        console.log("Written to serial port: connect");
        console.info(buffer);
    }

    public GetLastResponse(): any {
        return this.m_LastMessageReceived;
    }

    public DisconnectFromDevice(): void {
        let buffer = new Buffer(this.m_Messages["disconnect"]);
        this.m_SerialPort.write(buffer);

        console.log("Written to serial port: disconnect");
        console.info(buffer);
    }

    public Close(): void {
        this.m_SerialPort.close();

        console.log("SerialLink closed ...");
    }

    private SerialPort_OnOpen(): void {
        this.m_SerialPort.on("data", this.SerialPort_OnDataReceived.bind(this));
        this.m_SerialPort.on("close", this.SerialPort_OnClosed.bind(this));
        this.m_SerialPort.on("disconnect", this.SerialPort_OnDisconnected.bind(this));
        this.m_SerialPort.on("error", this.SerialPort_OnError.bind(this));

        console.log("Registered Callbacks!");
    }

    private SerialPort_OnDataReceived(data: Buffer) {
        let messageId = data.readUInt16BE(0);
        let messageSize = data.readUInt32BE(2);
        let payload = data.slice(6);

        console.log();
        console.log(" >      Id: " + messageId);
        console.log(" >    Size: " + messageSize);
        console.log(" > Buffer: (" + data.byteLength + " Bytes)");
        console.info(data);
        console.log(" > Payload: (" + payload.byteLength + " Bytes)");
        console.info(payload);

        this.m_LastMessageReceived = data;
    }

    private SerialPort_OnClosed(): void {
        console.log("SerialPort_OnClosed");
    }

    private SerialPort_OnDisconnected(error: any): void {
        console.log("SerialPort_OnDisconnected");
        console.error(error);
    }

    private SerialPort_OnError(error: any): void {
        console.log("SerialPort_OnError");
        console.error(error);
    }

    public ListAvailablePorts(): void {
        console.log("Listing available ports ...");

        SerialPort.list(function (err, ports) {
            ports.forEach(function (port) {
                console.log("    --- PORT ---");
                console.log("        " + port.comName);
                console.log("        " + port.pnpId);
                console.log("        " + port.manufacturer);
            });
        });
    }
}