/// <reference path="../../../node/serial/MessageAggregator.ts" /> 
/// <reference path="../../../../typings/index.d.ts" />

import { MessageAggregator } from "./../../../node/serial/MessageAggregator";

describe("MessageAggregator", function () {
    it("Complete buffers are stored in output queue", function () {
        let buffer1 = new Buffer([0, 1, 0, 0, 0, 5, 69, 69, 69, 69, 69]);
        let aggregator = new MessageAggregator();

        aggregator.PushBuffer(buffer1);
        let resultBuffer = aggregator.PopMessage();

        expect(resultBuffer.equals(new Buffer([0, 1, 0, 0, 0, 5, 69, 69, 69, 69, 69])));
    });

    it("Caches one buffer, appends part of a second buffer and stores composed message in output queue", function () {
        let buffer1 = new Buffer([0, 1, 0, 0, 0, 5, 69, 69, 69]);
        let buffer2 = new Buffer([69, 69, 0, 2, 0, 0, 0, 7]);

        let aggregator = new MessageAggregator();
        aggregator.PushBuffer(buffer1);
        aggregator.PushBuffer(buffer2);
        let resultBuffer = aggregator.PopMessage();

        expect(resultBuffer.entries())
            .toEqual(new Buffer([0, 1, 0, 0, 0, 5, 69, 69, 69, 69, 69]).entries());
    });

    it("Caches rest of the buffer after extracting parts of it", function () {
        let buffer1 = new Buffer([0, 1, 0, 0, 0, 5, 69, 69, 69]);
        let buffer2 = new Buffer([69, 69, 0, 2, 0, 0, 0, 7]);

        let aggregator = new MessageAggregator();
        aggregator.PushBuffer(buffer1);
        aggregator.PushBuffer(buffer2);
        let resultBuffer = aggregator.CachedBuffer;

        expect(resultBuffer.entries())
            .toEqual(new Buffer([0, 2, 0, 0, 0, 7]).entries());
    });

    it("Extracts a complete message from the buffer and caches the rest", function () {
        let buffer1 = new Buffer([0, 1, 0, 0, 0, 5, 69, 69, 69, 69, 69, 0, 2, 0, 0, 0, 7]);
        let aggregator = new MessageAggregator();

        aggregator.PushBuffer(buffer1);
        let completeBuffer = aggregator.PopMessage();
        let cachedBuffer = aggregator.CachedBuffer;

        expect(completeBuffer.entries())
            .toEqual(new Buffer([0, 1, 0, 0, 0, 5, 69, 69, 69, 69, 69]).entries());
        expect(cachedBuffer.entries())
            .toEqual(new Buffer([0, 2, 0, 0, 0, 7]).entries());
    });
});