/// <reference path="../../typings/index.d.ts" />
"use strict";
var express = require("express");
var path = require("path");
var ThingRouteCollection_1 = require("./routes/ThingRouteCollection");
var NodeExpressRouter = (function () {
    function NodeExpressRouter(app, logger) {
        this.app = app;
        this.logger = logger;
        this.rootDir = path.join(__dirname, "/..");
    }
    NodeExpressRouter.prototype.ApplyRoutes = function () {
        this.AddStaticRoute("/public");
        this.AddStaticRoute("/node_modules/@angular", "/@angular");
        this.AddStaticRoute("/node_modules/rxjs", "/rxjs");
        this.AddStaticRoute("/node_modules/node-waves/dist", "/waves");
        this.AddApiRoutes();
        return this.app;
    };
    NodeExpressRouter.prototype.AddStaticRoute = function (relativePath, alias) {
        var absolutePath = path.join(this.rootDir, relativePath);
        // if there is no alias, we can assume that this is our wwwroot
        if (typeof alias === "undefined") {
            this.app.use(express.static(absolutePath));
            this.logger.info(" > / -> " + absolutePath);
        }
        else {
            this.app.use(alias, express.static(absolutePath));
            this.logger.info(" > " + alias + " -> " + absolutePath);
        }
    };
    NodeExpressRouter.prototype.AddApiRoutes = function () {
        var thingRoutes = new ThingRouteCollection_1.ThingRouteCollection(this.app);
        this.app = thingRoutes.ApplyRoutes();
    };
    return NodeExpressRouter;
}());
exports.NodeExpressRouter = NodeExpressRouter;
//# sourceMappingURL=NodeExpressRouter.js.map