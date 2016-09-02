"use strict";
var SerialPort = require('serialport');
var fs = require('fs');
var path = require('path');
var SerialLink = (function () {
    function SerialLink(portName, baudRate) {
        console.log("Creating serial link to port '" + portName + "' with baud rate: " + baudRate);
        var jsonPath = path.join(__dirname, '../../src/common/messages.json');
        var jsonText = fs.readFileSync(jsonPath, 'utf8');
        var jsonObject = JSON.parse(jsonText);
        this.m_Messages = jsonObject;
        this.m_SerialPort = new SerialPort(portName, { baudRate: 9600, autoOpen: false });
        console.log("SerialLink created ...");
    }
    SerialLink.prototype.Open = function () {
        //this.m_SerialPort.open(this.SerialPort_OnOpen.bind(this));
        console.log("Opening serial link ...");
        var self = this;
        this.m_SerialPort.open(function () {
            self.m_SerialPort.on("data", function (data) {
                console.info(data);
            });
            var buffer = new Buffer(self.m_Messages["connect"]);
            self.m_SerialPort.write(buffer, function (err, written) {
                self.m_SerialPort.drain(function () {
                    console.log("Written to serial port: ");
                    console.info(buffer);
                });
            });
        });
    };
    SerialLink.prototype.Close = function () {
        this.m_SerialPort.close();
        console.log("SerialLink closed ...");
    };
    SerialLink.prototype.Connect = function () {
        var buffer = new Buffer(this.m_Messages["connect"]);
        this.m_SerialPort.write(buffer);
        console.log("Written to serial port: ");
        console.info(buffer);
    };
    SerialLink.prototype.Disconnect = function () {
        var buffer = new Buffer(this.m_Messages["disconnect"]);
        this.m_SerialPort.write(buffer);
        console.log("Written to serial port: ");
        console.info(buffer);
    };
    SerialLink.prototype.GetResponse = function () {
        return this.m_lastResponse;
    };
    SerialLink.prototype.SerialPort_OnOpen = function () {
        console.log("SerialLink connection opened ...");
        this.m_SerialPort.on("data", this.SerialPort_OnDataReceived.bind(this));
        this.m_SerialPort.on("error", this.SerialPort_OnError.bind(this));
        this.Connect();
    };
    SerialLink.prototype.SerialPort_OnError = function (error) {
        console.log("SerialLink ERROR");
        console.info(error);
    };
    SerialLink.prototype.SerialPort_OnDataReceived = function (data) {
        console.info(typeof data);
        console.info(data);
        this.m_lastResponse = data;
        this.Disconnect();
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