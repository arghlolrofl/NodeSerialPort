/// <reference path="../../../node/serial/MessageAggregator.ts" /> 
/// <reference path="../../../../typings/index.d.ts" />

import { MessageAggregator } from "./../../../node/serial/MessageAggregator";
import { EventNames } from "./../../../node/config/EventNames";

describe("MessageAggregator", function () {
    it("MessageAggregator raises event with assembled buffer data", function () {
        let testBuffer = new Buffer([0, 1, 0, 0, 0, 5, 69, 69, 69, 69, 69]);
        let aggregator = new MessageAggregator();

        let resultBuffer: Buffer = null;
        aggregator.Events.on(
            EventNames.MessageAggregator.BUFFER_ASSEMBLING_COMPLETED,
            (data: Buffer) => {
                resultBuffer = data;
            }
        );
        aggregator.pushBuffer(testBuffer);

        waitsFor(() => {
            return resultBuffer !== null;
        }, "Message Aggregator should raise an event when assembling is completed", 5000);

        runs(() => {
            expect(resultBuffer.equals(new Buffer([0, 1, 0, 0, 0, 5, 69, 69, 69, 69, 69]))).toBeTruthy();
        });
    });

    it("Assembles result buffer from multiple buffers", function () {
        let buffer1 = new Buffer([0, 1, 0, 0, 0, 5, 69, 69, 69]);
        let buffer2 = new Buffer([69, 69, 0, 2, 0, 0, 0, 7]);

        let resultBuffer: Buffer = null;
        let aggregator = new MessageAggregator();
        aggregator.Events.on(
            EventNames.MessageAggregator.BUFFER_ASSEMBLING_COMPLETED,
            (data: Buffer) => {
                resultBuffer = data;
            }
        );
        aggregator.pushBuffer(buffer1);
        aggregator.pushBuffer(buffer2);

        waitsFor(() => {
            return resultBuffer !== null;
        }, "Message Aggregator should raise an event when assembling is completed", 5000);

        runs(() => {
            expect(resultBuffer.equals(new Buffer([0, 1, 0, 0, 0, 5, 69, 69, 69, 69, 69]))).toBeTruthy();
        });
    });

    it("Caches incompletely assembled buffers", function () {
        let buffer1 = new Buffer([0, 1, 0, 0, 0, 5, 69, 69, 69, 69, 69, 0, 2, 0, 0, 0, 7]);

        let resultBuffer: Buffer = null;
        let aggregator = new MessageAggregator();
        aggregator.Events.on(
            EventNames.MessageAggregator.BUFFER_ASSEMBLING_COMPLETED,
            (data: Buffer) => {
                resultBuffer = data;
            }
        );
        aggregator.pushBuffer(buffer1);

        waitsFor(() => {
            return (aggregator.CachedBuffer !== null)
        }, "Message Aggregator should cache incompletely assembled buffers", 5000);

        runs(() => {
            expect(resultBuffer.equals(new Buffer([0, 1, 0, 0, 0, 5, 69, 69, 69, 69, 69]))).toBeTruthy();
            expect(aggregator.CachedBuffer.equals(new Buffer([0, 2, 0, 0, 0, 7]))).toBeTruthy();
        });
    });
});