import * as EventEmitter from "eventemitter3";
import { EventNames } from "./../config/EventNames";
import { IBufferInput } from "./../interfaces/IBufferInput";

/**
 * This class is responsible to assembly incoming buffers
 * and compose them to complete messages.
 *
 * Incoming buffers from the device are stored in the IncomingBufferCache.
 * Completely assembled messages are being put into the OutgoingMessageCache.
 */
export class MessageAggregator implements IBufferInput {
    //#region Private Members

    private incomingBufferCache: Array<Buffer>;
    private cachedBuffer: Buffer;
    private isLastMessageIncomplete: boolean;
    private events: EventEmitter3.EventEmitter = new EventEmitter();
    private registeredEvents: Array<string>;

    //#endregion

    //#region Properties

    /**
     * Gets the cached buffer
     */
    public get CachedBuffer(): Buffer { return this.cachedBuffer; }
    /**
     * Class' event emitter
     */
    public get Events(): EventEmitter3.EventEmitter { return this.events; }

    //#endregion

    //#region Initialization

    /**
     * Creates a new instance of the MessageAggregator class
     */
    constructor() {
        this.incomingBufferCache = new Array<Buffer>();
        this.registeredEvents = new Array<string>();
        this.isLastMessageIncomplete = false;
    }

    //#endregion

    /**
     * Adds a buffer to process queue.
     * 
     * @param buffer Incoming buffer from the device
     */
    public pushBuffer(buffer: Buffer): void {
        this.incomingBufferCache.push(buffer);
        this.processIncomingBuffers();
    }

    /**
     * Interface method used to register custom events that are being
     * raised, when an assembly is complete.
     *
     * @param eventName Name of the event to be emitted
     */
    public registerEventForNewInput(eventName: string): void {
        this.registeredEvents.push(eventName);
    }


    //#region Helpers

    /**
     * Assembles data from incoming buffers and composes complete
     * device messages (header [6 Bytes] + body) and puts them into the
     * output queue.
     */
    private processIncomingBuffers() {
        while (this.incomingBufferCache.length > 0) {
            // shift the next incoming buffer from incoming buffer cache
            let incomingBuffer: Buffer = this.incomingBufferCache.shift();
            console.info(incomingBuffer);

            // concat this buffer with cached one if it was incomplete
            if (this.isLastMessageIncomplete) {
                incomingBuffer = this.concatBuffers(this.cachedBuffer, incomingBuffer);
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
            } else if (incomingBuffer.byteLength < (messageSize + 6)) {
                // in this case, the incoming buffer contains an incomplete
                // message, so we must set the incomplete flag and
                // process the next buffer
                this.cachedBuffer = new Buffer(incomingBuffer);
                this.isLastMessageIncomplete = true;

                continue;
            } else {
                // here we have more than one complete message in the incoming
                // buffer, so we will extract the complete message to the output
                // queue. the rest of the buffer will then be checked in the next
                // iteration.
                this.incomingBufferCache.unshift(
                    incomingBuffer.slice(messageSize + 6));

                incomingBuffer = incomingBuffer.slice(0, messageSize + 6);
            }

            this.raiseNewInputEvent(incomingBuffer);
        }
    }

    /**
     * Concatenates the contents of two buffers and returns a new one.
     *
     * @param buffer1 First buffer to concatenate
     * @param buffer2 Second buffer to concatenate
     */
    private concatBuffers(buffer1: Buffer, buffer2: Buffer): Buffer {
        let concatenatedBuffer = new Buffer(buffer1.length + buffer2.length);

        let elemCount = 0;
        for (let i = 0; i < buffer1.length; i++) {
            let elem = buffer1.readUInt8(i);

            concatenatedBuffer.writeUInt8(elem, elemCount++);
        }

        for (let i = 0; i < buffer2.length; i++) {
            let elem = buffer2.readUInt8(i);
            concatenatedBuffer.writeUInt8(elem, elemCount++);
        }

        return concatenatedBuffer;
    }

    /**
     * Raises custom events, when an assembly is complete.
     *
     * @param data Completely assembled buffer that will be emitted
     */
    private raiseNewInputEvent(data: Buffer): void {
        this.events.emit(EventNames.MessageAggregator.BUFFER_ASSEMBLING_COMPLETED, data);
        for (let i = 0; i < this.registeredEvents.length; i++) {
            this.events.emit(this.registeredEvents[i], data);
        }
    }

    //#endregion
}