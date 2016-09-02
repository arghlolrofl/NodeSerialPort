import * as SerialPort from 'serialport';
import * as fs from 'fs';
import * as path from 'path';

export class SerialLink {
    private m_Messages: any;
    private m_SerialPort: SerialPort;
    private m_lastResponse: any;


    constructor(portName: string, baudRate: number) {
        console.log("Creating serial link to port '" + portName + "' with baud rate: " + baudRate);

        let jsonPath = path.join(__dirname, '../../src/common/messages.json');
        let jsonText: string = fs.readFileSync(jsonPath, 'utf8');
        let jsonObject = JSON.parse(jsonText);

        this.m_Messages = jsonObject;

        this.m_SerialPort = new SerialPort(portName, { baudRate: 9600, autoOpen: false });

        console.log("SerialLink created ...");
    }

    public Open(): void {
        //this.m_SerialPort.open(this.SerialPort_OnOpen.bind(this));
        console.log("Opening serial link ...");

        let self = this;

        this.m_SerialPort.open(function () {
            self.m_SerialPort.on("data", function (data: any) {
                console.info(data);
            });

            let buffer = new Buffer(self.m_Messages["connect"]);
            self.m_SerialPort.write(buffer, function (err: any, written: number) {
                self.m_SerialPort.drain(function () {
                    console.log("Written to serial port: ");
                    console.info(buffer);
                });
            });
            
        });
    }

    public Close(): void {
        this.m_SerialPort.close();
        console.log("SerialLink closed ...");
    }

    public Connect(): void {
        let buffer = new Buffer(this.m_Messages["connect"]);
        this.m_SerialPort.write(buffer);

        console.log("Written to serial port: ");
        console.info(buffer);
    }

    public Disconnect(): void {
        let buffer = new Buffer(this.m_Messages["disconnect"]);
        this.m_SerialPort.write(buffer);

        console.log("Written to serial port: ");
        console.info(buffer);
    }

    public GetResponse(): any {
        return this.m_lastResponse;
    }

    private SerialPort_OnOpen(): void {
        console.log("SerialLink connection opened ...");

        this.m_SerialPort.on("data", this.SerialPort_OnDataReceived.bind(this));
        this.m_SerialPort.on("error", this.SerialPort_OnError.bind(this));

        this.Connect();
    }

    private SerialPort_OnError(error: any): void {
        console.log("SerialLink ERROR");
        console.info(error);
    }

    private SerialPort_OnDataReceived(data: any) {
        console.info(typeof data);
        console.info(data);

        this.m_lastResponse = data;

        this.Disconnect();
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