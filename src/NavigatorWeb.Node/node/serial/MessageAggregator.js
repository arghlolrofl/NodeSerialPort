//import { EventEmitter } from '@angular/core';
"use strict";
//var jasmine = require('jasmine-core');
var MessageAggregator = (function () {
    //private BufferReceived$: EventEmitter<void>;
    //public MessageReceived$: EventEmitter<Buffer>;
    function MessageAggregator() {
        this.BufferCache = new Array();
        this.MessageBuffer = new Array();
        //this.BufferReceived$.subscribe(this.ProcessIncomingBuffers.bind(this));
        //this.MessageReceived$ = new EventEmitter<Buffer>();
        //this.BufferReceived$ = new EventEmitter<void>();
    }
    MessageAggregator.prototype.ProcessIncomingBuffers = function () {
        while (this.BufferCache.length > 0) {
            var buffer = this.BufferCache.shift();
            var messageId = buffer.readUInt16BE(0);
            var messageSize = buffer.readUInt32BE(2);
            console.log("Processing new buffer ...");
            console.log(" > Length: " + buffer.byteLength);
            console.log(" >     Id: " + messageId);
            console.log(" >   Size: " + messageSize);
        }
    };
    MessageAggregator.prototype.PushBuffer = function (buffer) {
        this.BufferCache.push(buffer);
        //this.BufferReceived$.emit();
        this.ProcessIncomingBuffers();
    };
    MessageAggregator.prototype.PopMessage = function () {
        return this.MessageBuffer.shift();
    };
    return MessageAggregator;
}());
exports.MessageAggregator = MessageAggregator;
//# sourceMappingURL=MessageAggregator.js.map