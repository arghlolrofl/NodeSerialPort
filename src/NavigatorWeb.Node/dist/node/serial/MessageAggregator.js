// import { EventEmitter } from "@angular/core";
"use strict";
/**
 * This class is responsible to assembly incoming buffers
 * and compose them to complete messages.
 *
 * Incoming buffers from the device are stored in the IncomingBufferCache.
 * Completely assembled messages are being put into the OutgoingMessageCache.
 */
var MessageAggregator = (function () {
    /**
     * Creates a new instance of the MessageAggregator class
     */
    function MessageAggregator() {
        this.IncomingBufferCache = new Array();
        this.OutgoingMessageBuffer = new Array();
        this.IsLastMessageIncomplete = false;
    }
    /**
     * Gets the cached buffer
     */
    MessageAggregator.prototype.GetCachedBuffer = function () {
        return this.CachedBuffer;
    };
    /**
     * Adds a buffer to process queue.
     *
     * @param buffer Incoming buffer from the device
     */
    MessageAggregator.prototype.PushBuffer = function (buffer) {
        this.IncomingBufferCache.push(buffer);
        // this.BufferReceived$.emit();
        this.ProcessIncomingBuffers();
    };
    /**
     * Returns the next completely assembled message buffer
     */
    MessageAggregator.prototype.PopMessage = function () {
        if (this.OutgoingMessageBuffer.length > 0)
            return this.OutgoingMessageBuffer.shift();
        return null;
    };
    /**
     * Assembles data from incoming buffers and composes complete
     * device messages (header [6 Bytes] + body) and puts them into the
     * output queue.
     */
    MessageAggregator.prototype.ProcessIncomingBuffers = function () {
        while (this.IncomingBufferCache.length > 0) {
            // shift the next incoming buffer from incoming buffer cache
            var incomingBuffer = this.IncomingBufferCache.shift();
            // concat this buffer with cached one if it was incomplete
            if (this.IsLastMessageIncomplete) {
                incomingBuffer = this.ConcatBuffers(this.CachedBuffer, incomingBuffer);
                // for now we will assume, that the concatenated buffer
                // will contain a complete message
                this.IsLastMessageIncomplete = false;
            }
            // read header info
            var messageId = incomingBuffer.readUInt16BE(0);
            var messageSize = incomingBuffer.readUInt32BE(2);
            if (incomingBuffer.byteLength === (messageSize + 6)) {
                // here we know, that we have a complete message in the buffer,
                // so we can push it directly to the output queue
                this.OutgoingMessageBuffer.push(incomingBuffer);
            }
            else if (incomingBuffer.byteLength < (messageSize + 6)) {
                // in this case, the incoming buffer contains an incomplete
                // message, so we must set the incomplete flag and
                // process the next buffer
                this.CachedBuffer = new Buffer(incomingBuffer);
                this.IsLastMessageIncomplete = true;
            }
            else {
                // here we have more than one complete message in the incoming
                // buffer, so we will extract the complete message to the output
                // queue. the rest of the buffer will then be checked in the next
                // iteration.
                this.OutgoingMessageBuffer.push(incomingBuffer.slice(0, messageSize + 6));
                this.IncomingBufferCache.unshift(incomingBuffer.slice(messageSize + 6));
            }
        }
    };
    /**
     * Concatenates the contents of two buffers and returns a new one.
     *
     * @param buffer1 First buffer to concatenate
     * @param buffer2 Second buffer to concatenate
     */
    MessageAggregator.prototype.ConcatBuffers = function (buffer1, buffer2) {
        var b = new Buffer(buffer1.length + buffer2.length);
        var elemCount = 0;
        for (var i = 0; i < buffer1.length; i++) {
            var elem = buffer1.readUInt8(i);
            b.writeUInt8(elem, elemCount);
            elemCount++;
        }
        for (var i = 0; i < buffer2.length; i++) {
            var elem = buffer2.readUInt8(i);
            b.writeUInt8(elem, elemCount);
            elemCount++;
        }
        return b;
    };
    return MessageAggregator;
}());
exports.MessageAggregator = MessageAggregator;
//# sourceMappingURL=MessageAggregator.js.map