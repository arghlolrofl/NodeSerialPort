import * as EventEmitter from "eventemitter3";
import { EventNames } from "./../config/EventNames";

/**
 * This class is responsible to assembly incoming buffers
 * and compose them to complete messages.
 *
 * Incoming buffers from the device are stored in the IncomingBufferCache.
 * Completely assembled messages are being put into the OutgoingMessageCache.
 */
export class MessageAggregator {
    private outgoingMessageBuffer: Array<Buffer>;
    private incomingBufferCache: Array<Buffer>;
    private cachedBuffer: Buffer;
    private isLastMessageIncomplete: boolean;
    private events: EventEmitter3.EventEmitter = new EventEmitter();

    //#region Properties

    /**
     * Flag indicating, if there are complete messages available
     */
    public get HasMessages(): boolean { return this.outgoingMessageBuffer.length > 0; }
    /**
     * Gets the cached buffer
     */
    public get CachedBuffer(): Buffer { return this.cachedBuffer; }

    public get Events(): EventEmitter3.EventEmitter { return this.events; }

    //#endregion

    /**
     * Creates a new instance of the MessageAggregator class
     */
    constructor() {
        this.incomingBufferCache = new Array<Buffer>();
        this.outgoingMessageBuffer = new Array<Buffer>();
        this.isLastMessageIncomplete = false;
    }


    /**
     * Adds a buffer to process queue.
     * 
     * @param buffer Incoming buffer from the device
     */
    public PushBuffer(buffer: Buffer): void {
        this.incomingBufferCache.push(buffer);
        this.ProcessIncomingBuffers();
    }

    /**
     * Returns the next completely assembled message buffer
     */
    public PopMessage() {
        if (this.outgoingMessageBuffer.length > 0)
            return this.outgoingMessageBuffer.shift();

        return null;
    }

    /**
     * Assembles data from incoming buffers and composes complete
     * device messages (header [6 Bytes] + body) and puts them into the
     * output queue.
     */
    private ProcessIncomingBuffers() {
        while (this.incomingBufferCache.length > 0) {
            // shift the next incoming buffer from incoming buffer cache
            let incomingBuffer: Buffer = this.incomingBufferCache.shift();
            console.info(incomingBuffer);

            // concat this buffer with cached one if it was incomplete
            if (this.isLastMessageIncomplete) {
                incomingBuffer = this.ConcatBuffers(this.cachedBuffer, incomingBuffer);
                // for now we will assume, that the concatenated buffer
                // will contain a complete message
                this.isLastMessageIncomplete = false;
            }

            // read header info
            let messageId: number = incomingBuffer.readUInt16BE(0);
            let messageSize: number = incomingBuffer.readUInt32BE(2);


            if (incomingBuffer.byteLength === (messageSize + 6)) {
                // here we know, that we have a complete message in the buffer,
                // so we can push it directly to the output queue

                //this.outgoingMessageBuffer.push(incomingBuffer);
                this.events.emit(EventNames.MessageAggregator.BUFFER_ASSEMBLING_COMPLETED, incomingBuffer);
            } else if (incomingBuffer.byteLength < (messageSize + 6)) {
                // in this case, the incoming buffer contains an incomplete
                // message, so we must set the incomplete flag and
                // process the next buffer
                this.cachedBuffer = new Buffer(incomingBuffer);
                this.isLastMessageIncomplete = true;
            } else {
                // here we have more than one complete message in the incoming
                // buffer, so we will extract the complete message to the output
                // queue. the rest of the buffer will then be checked in the next
                // iteration.
                let tempBuffer = incomingBuffer.slice(0, messageSize + 6);
                this.events.emit(EventNames.MessageAggregator.BUFFER_ASSEMBLING_COMPLETED, tempBuffer);

                this.incomingBufferCache.unshift(
                    incomingBuffer.slice(messageSize + 6));
            }
        }
    }

    /**
     * Concatenates the contents of two buffers and returns a new one.
     *
     * @param buffer1 First buffer to concatenate
     * @param buffer2 Second buffer to concatenate
     */
    private ConcatBuffers(buffer1: Buffer, buffer2: Buffer): Buffer {
        let b = new Buffer(buffer1.length + buffer2.length);

        let elemCount = 0;
        for (let i = 0; i < buffer1.length; i++) {
            let elem = buffer1.readUInt8(i);

            b.writeUInt8(elem, elemCount);

            elemCount++;
        }

        for (let i = 0; i < buffer2.length; i++) {
            let elem = buffer2.readUInt8(i);

            b.writeUInt8(elem, elemCount);

            elemCount++;
        }

        return b;
    }
}