"use strict";
(function (Environment) {
    Environment[Environment["DEBUG"] = 0] = "DEBUG";
    Environment[Environment["TRACE"] = 1] = "TRACE";
    Environment[Environment["RELEASE"] = 2] = "RELEASE";
    Environment[Environment["PRODUCTION"] = 3] = "PRODUCTION";
})(exports.Environment || (exports.Environment = {}));
var Environment = exports.Environment;
//# sourceMappingURL=Environment.js.map