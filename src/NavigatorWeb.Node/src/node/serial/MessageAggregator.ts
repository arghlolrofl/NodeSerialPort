//import { EventEmitter } from '@angular/core';

//var jasmine = require('jasmine-core');

export class MessageAggregator {
    private MessageBuffer: Array<Buffer>;
    private BufferCache: Array<Buffer>;
    private CurrentBuffer: Buffer;
    private IsLastMessageIncomplete: boolean;
    private MissingBytesCount: number;

    //private BufferReceived$: EventEmitter<void>;
    //public MessageReceived$: EventEmitter<Buffer>;



    constructor() {
        this.BufferCache = new Array<Buffer>();
        this.MessageBuffer = new Array<Buffer>();
        this.IsLastMessageIncomplete = false;

        //this.BufferReceived$.subscribe(this.ProcessIncomingBuffers.bind(this));

        //this.MessageReceived$ = new EventEmitter<Buffer>();
        //this.BufferReceived$ = new EventEmitter<void>();
    }

    private ProcessIncomingBuffers() {
        while (this.BufferCache.length > 0) {
            let buffer: Buffer = this.BufferCache.shift();

            if (this.IsLastMessageIncomplete) {
                if (buffer.byteLength >= this.MissingBytesCount) {
                    let b = new Buffer(this.CurrentBuffer.length + this.MissingBytesCount);

                    //let cache = new Array<number>();

                    let elemCount = 0;
                    for (var i = 0; i < this.CurrentBuffer.length; i++) {
                        let elem = buffer.readUInt8(i);
                        b.writeUInt8(elem, elemCount);

                        elemCount++;
                    }

                    for (var i = 0; i < buffer.length; i++) {
                        let elem = buffer.readUInt8(i);
                        b.writeUInt8(elem, elemCount);

                        elemCount++;
                    }
                    
                    this.CurrentBuffer = b;
                }
            }

            let messageId: number = buffer.readUInt16BE(0);
            let messageSize: number = buffer.readUInt32BE(2);
                        
            console.log("Processing new buffer ...");
            console.log(" > Buffer: " + buffer.byteLength);
            console.log(" >   Size: " + messageSize);

            if (buffer.byteLength > (messageSize + 6)) {
                this.CurrentBuffer = new Buffer(buffer);
                this.IsLastMessageIncomplete = true;
                this.MissingBytesCount = buffer.byteLength - (messageSize + 6);
            }
        }
    }

    public PushBuffer(buffer: Buffer): void {
        this.BufferCache.push(buffer);
        //this.BufferReceived$.emit();
        this.ProcessIncomingBuffers();
    }

    public PopMessage() {
        return this.MessageBuffer.shift();
    }
}