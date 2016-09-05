describe("MessageAggregator", function () {
    require('reflect-metadata');
    var _agg = require('../../../node/serial/MessageAggregator');

    it("should return a recomposed buffer", function () {
        var buffer1 = new Buffer([0, 1, 0, 0, 0, 4, 69, 69]);
        var buffer2 = new Buffer([69, 69, 77, 77]);

        var aggregator = new _agg.MessageAggregator();
        aggregator.PushBuffer(buffer1);
        aggregator.PushBuffer(buffer2);

        var resultBuffer = aggregator.PopMessage();

        expect(resultBuffer).toEqual(new Buffer([0, 1, 0, 0, 4, 69, 69, 69, 69]));
    });
});