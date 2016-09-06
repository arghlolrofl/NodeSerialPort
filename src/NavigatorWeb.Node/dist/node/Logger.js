"use strict";
var Environment_1 = require("./Environment");
var Logger = (function () {
    function Logger(env) {
        this.environment = env;
    }
    Logger.prototype.log = function (msg) {
        if (this.environment === Environment_1.Environment.DEBUG) {
            console.log(msg);
        }
    };
    Logger.prototype.dump = function (obj) {
        if (this.environment === Environment_1.Environment.DEBUG) {
            console.info(obj);
        }
    };
    Logger.prototype.error = function (err) {
        if (this.environment === Environment_1.Environment.DEBUG) {
            console.error(err);
        }
    };
    return Logger;
}());
exports.Logger = Logger;
//# sourceMappingURL=Logger.js.map