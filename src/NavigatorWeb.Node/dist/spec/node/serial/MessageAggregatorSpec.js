/// <reference path="../../../node/serial/MessageAggregator.ts" /> 
/// <reference path="../../../../typings/index.d.ts" />
"use strict";
var MessageAggregator_1 = require("./../../../node/serial/MessageAggregator");
describe("MessageAggregator", function () {
    it("Complete buffers are stored in output queue", function () {
        var buffer1 = new Buffer([0, 1, 0, 0, 0, 5, 69, 69, 69, 69, 69]);
        var aggregator = new MessageAggregator_1.MessageAggregator();
        aggregator.PushBuffer(buffer1);
        var resultBuffer = aggregator.PopMessage();
        expect(resultBuffer.equals(new Buffer([0, 1, 0, 0, 0, 5, 69, 69, 69, 69, 69])));
    });
    it("Caches one buffer, appends part of a second buffer and stores composed message in output queue", function () {
        var buffer1 = new Buffer([0, 1, 0, 0, 0, 5, 69, 69, 69]);
        var buffer2 = new Buffer([69, 69, 0, 2, 0, 0, 0, 7]);
        var aggregator = new MessageAggregator_1.MessageAggregator();
        aggregator.PushBuffer(buffer1);
        aggregator.PushBuffer(buffer2);
        var resultBuffer = aggregator.PopMessage();
        expect(resultBuffer.entries())
            .toEqual(new Buffer([0, 1, 0, 0, 0, 5, 69, 69, 69, 69, 69]).entries());
    });
    it("Caches rest of the buffer after extracting parts of it", function () {
        var buffer1 = new Buffer([0, 1, 0, 0, 0, 5, 69, 69, 69]);
        var buffer2 = new Buffer([69, 69, 0, 2, 0, 0, 0, 7]);
        var aggregator = new MessageAggregator_1.MessageAggregator();
        aggregator.PushBuffer(buffer1);
        aggregator.PushBuffer(buffer2);
        var resultBuffer = aggregator.GetCachedBuffer();
        expect(resultBuffer.entries())
            .toEqual(new Buffer([0, 2, 0, 0, 0, 7]).entries());
    });
    it("Extracts a complete message from the buffer and caches the rest", function () {
        var buffer1 = new Buffer([0, 1, 0, 0, 0, 5, 69, 69, 69, 69, 69, 0, 2, 0, 0, 0, 7]);
        var aggregator = new MessageAggregator_1.MessageAggregator();
        aggregator.PushBuffer(buffer1);
        var completeBuffer = aggregator.PopMessage();
        var cachedBuffer = aggregator.GetCachedBuffer();
        expect(completeBuffer.entries())
            .toEqual(new Buffer([0, 1, 0, 0, 0, 5, 69, 69, 69, 69, 69]).entries());
        expect(cachedBuffer.entries())
            .toEqual(new Buffer([0, 2, 0, 0, 0, 7]).entries());
    });
});
//# sourceMappingURL=MessageAggregatorSpec.js.map