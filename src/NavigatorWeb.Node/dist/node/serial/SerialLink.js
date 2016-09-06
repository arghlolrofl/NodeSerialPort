"use strict";
var SerialPort = require("serialport");
var fs = require("fs");
var path = require("path");
var SerialLink = (function () {
    function SerialLink(portName, baudRate, logger) {
        this.READ_BUFFER_SIZE = 65536;
        this.logger = logger;
        this.logger.log("Creating serial link to port '" + portName + "' with baud rate: " + baudRate);
        var jsonPath = path.join(__dirname, "../../common/messages.json");
        var jsonText = fs.readFileSync(jsonPath, "utf8");
        var jsonObject = JSON.parse(jsonText);
        this.m_Messages = jsonObject;
        this.serialPort = new SerialPort(portName, {
            baudRate: baudRate,
            parity: "odd",
            bufferSize: this.READ_BUFFER_SIZE,
            autoOpen: false
        });
        this.logger.log("SerialLink initialized ...");
    }
    SerialLink.prototype.Open = function () {
        this.serialPort.open(this.SerialPort_OnOpen.bind(this));
    };
    SerialLink.prototype.ConnectToDevice = function () {
        var buffer = new Buffer(this.m_Messages["connect"]);
        this.serialPort.write(buffer);
        this.logger.log("Written to serial port: connect");
        this.logger.dump(buffer);
    };
    SerialLink.prototype.GetLastResponse = function () {
        return this.m_LastMessageReceived;
    };
    SerialLink.prototype.DisconnectFromDevice = function () {
        var buffer = new Buffer(this.m_Messages["disconnect"]);
        this.serialPort.write(buffer);
        this.logger.log("Written to serial port: disconnect");
        this.logger.dump(buffer);
    };
    SerialLink.prototype.Close = function () {
        this.serialPort.close();
        this.logger.log("SerialLink closed ...");
    };
    SerialLink.prototype.SerialPort_OnOpen = function () {
        this.serialPort.on("data", this.SerialPort_OnDataReceived.bind(this));
        this.serialPort.on("close", this.SerialPort_OnClosed.bind(this));
        this.serialPort.on("disconnect", this.SerialPort_OnDisconnected.bind(this));
        this.serialPort.on("error", this.SerialPort_OnError.bind(this));
        this.logger.log("Registered Callbacks!");
    };
    SerialLink.prototype.SerialPort_OnDataReceived = function (data) {
        var messageId = data.readUInt16BE(0);
        var messageSize = data.readUInt32BE(2);
        var payload = data.slice(6);
        this.logger.log("");
        this.logger.log(" >      Id: " + messageId);
        this.logger.log(" >    Size: " + messageSize);
        this.logger.log(" > Buffer: (" + data.byteLength + " Bytes)");
        this.logger.dump(data);
        this.logger.log(" > Payload: (" + payload.byteLength + " Bytes)");
        this.logger.dump(payload);
        this.m_LastMessageReceived = data;
    };
    SerialLink.prototype.SerialPort_OnClosed = function () {
        this.logger.log("SerialPort_OnClosed");
    };
    SerialLink.prototype.SerialPort_OnDisconnected = function (error) {
        this.logger.log("SerialPort_OnDisconnected");
        this.logger.error(error);
    };
    SerialLink.prototype.SerialPort_OnError = function (error) {
        this.logger.log("SerialPort_OnError");
        this.logger.error(error);
    };
    SerialLink.prototype.ListAvailablePorts = function () {
        this.logger.log("Listing available ports ...");
        SerialPort.list(function (err, ports) {
            ports.forEach(function (port) {
                this.logger.log("    --- PORT ---");
                this.logger.log("        " + port.comName);
                this.logger.log("        " + port.pnpId);
                this.logger.log("        " + port.manufacturer);
            });
        });
    };
    return SerialLink;
}());
exports.SerialLink = SerialLink;
//# sourceMappingURL=SerialLink.js.map