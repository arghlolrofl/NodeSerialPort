"use strict";
var SerialPort = require('serialport');
var fs = require('fs');
var path = require('path');
var SerialLink = (function () {
    function SerialLink(portName, baudRate) {
        this.READ_BUFFER_SIZE = 65536;
        console.log("Creating serial link to port '" + portName + "' with baud rate: " + baudRate);
        var jsonPath = path.join(__dirname, '../../src/common/messages.json');
        var jsonText = fs.readFileSync(jsonPath, 'utf8');
        var jsonObject = JSON.parse(jsonText);
        this.m_Messages = jsonObject;
        this.m_SerialPort = new SerialPort(portName, {
            baudRate: baudRate,
            parity: "odd",
            bufferSize: this.READ_BUFFER_SIZE,
            autoOpen: false
        });
        console.log("SerialLink initialized ...");
    }
    SerialLink.prototype.Open = function () {
        this.m_SerialPort.open(this.SerialPort_OnOpen.bind(this));
    };
    SerialLink.prototype.ConnectToDevice = function () {
        var buffer = new Buffer(this.m_Messages["connect"]);
        this.m_SerialPort.write(buffer);
        console.log("Written to serial port: connect");
        console.info(buffer);
    };
    SerialLink.prototype.GetLastResponse = function () {
        return this.m_LastMessageReceived;
    };
    SerialLink.prototype.DisconnectFromDevice = function () {
        var buffer = new Buffer(this.m_Messages["disconnect"]);
        this.m_SerialPort.write(buffer);
        console.log("Written to serial port: disconnect");
        console.info(buffer);
    };
    SerialLink.prototype.Close = function () {
        this.m_SerialPort.close();
        console.log("SerialLink closed ...");
    };
    SerialLink.prototype.SerialPort_OnOpen = function () {
        this.m_SerialPort.on("data", this.SerialPort_OnDataReceived.bind(this));
        this.m_SerialPort.on("close", this.SerialPort_OnClosed.bind(this));
        this.m_SerialPort.on("disconnect", this.SerialPort_OnDisconnected.bind(this));
        this.m_SerialPort.on("error", this.SerialPort_OnError.bind(this));
        console.log("Registered Callbacks!");
    };
    SerialLink.prototype.SerialPort_OnDataReceived = function (data) {
        var messageId = data.readUInt16BE(0);
        var messageSize = data.readUInt32BE(2);
        var payload = data.slice(6);
        console.log();
        console.log(" >      Id: " + messageId);
        console.log(" >    Size: " + messageSize);
        console.log(" > Buffer: (" + data.byteLength + " Bytes)");
        console.info(data);
        console.log(" > Payload: (" + payload.byteLength + " Bytes)");
        console.info(payload);
        this.m_LastMessageReceived = data;
    };
    SerialLink.prototype.SerialPort_OnClosed = function () {
        console.log("SerialPort_OnClosed");
    };
    SerialLink.prototype.SerialPort_OnDisconnected = function (error) {
        console.log("SerialPort_OnDisconnected");
        console.error(error);
    };
    SerialLink.prototype.SerialPort_OnError = function (error) {
        console.log("SerialPort_OnError");
        console.error(error);
    };
    SerialLink.prototype.ListAvailablePorts = function () {
        console.log("Listing available ports ...");
        SerialPort.list(function (err, ports) {
            ports.forEach(function (port) {
                console.log("    --- PORT ---");
                console.log("        " + port.comName);
                console.log("        " + port.pnpId);
                console.log("        " + port.manufacturer);
            });
        });
    };
    return SerialLink;
}());
exports.SerialLink = SerialLink;
//# sourceMappingURL=node.serial.link.js.map