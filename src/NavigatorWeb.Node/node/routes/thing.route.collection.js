/// <reference path="../../../typings/index.d.ts" />
"use strict";
var ThingRouteCollection = (function () {
    function ThingRouteCollection(app) {
        this.app = app;
    }
    ThingRouteCollection.prototype.ApplyRoutes = function () {
        this.applyGetAll();
        this.applyGetSingle();
        return this.app;
    };
    /**
     * GET: /api/thing
     */
    ThingRouteCollection.prototype.applyGetAll = function () {
        this.app.get('/thing', function (req, res, next) {
            res.send("LIST OF THINGS (2)");
        });
    };
    /**
     * GET: /api/thing/{thing_id}
     */
    ThingRouteCollection.prototype.applyGetSingle = function () {
        this.app.get('/thing/:thing_id', function (req, res, next) {
            var requestParameter = req.params;
            res.send("THING DETAILS [" + requestParameter.thing_id + "] (2)");
        });
    };
    return ThingRouteCollection;
}());
exports.ThingRouteCollection = ThingRouteCollection;
//# sourceMappingURL=thing.route.collection.js.map