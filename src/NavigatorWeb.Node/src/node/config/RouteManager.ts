/// <reference path="../../../typings/index.d.ts" />

import * as express from "express";
import * as path from "path";

import { ThingRouteCollection } from "./../routes/ThingRouteCollection";
import { ICanLog } from "./../interfaces/IcanLog";

/**
 * Configuration manager for setting desired routes in
 * the express application's web server.
 */
export class RouteManager {
    //#region Private Members

    private app: express.Application;
    private logger: ICanLog;
    private rootPath: string;

    //#endregion


    //#region Initialization

    /**
     * Creates a new instance of the RouteManager class.
     *
     * @param app Express Application instance
     * @param logger Logger instance
     * @param rootPath Project's root path
     */
    constructor(
        app: express.Application,
        logger: ICanLog,
        rootPath: string
    ) {
        this.app = app;
        this.logger = logger;
        this.rootPath = rootPath;
    }

    //#endregion


    //#region Public Methods

    public ApplyRoutes(): express.Application {
        this.logger.log("Configuring routes ...");

        this.AddStaticRoute("/public");
        this.AddStaticRoute("/dist/app", "/app");
        this.AddStaticRoute("/dist/common", "/common");
        this.AddStaticRoute("/node_modules", "/node_modules");
        this.AddStaticRoute("/node_modules/eventemitter3", "/eventemitter3");


        this.AddApiRoutes();

        return this.app;
    }

    //#endregion

    //#region Helpers

    /**
     * Adds a static route to the web server instance.
     *
     * @param relativePath The relative path the route will refer to
     * @param alias The alias for the relative path (leave empty for wwwroot)
     */
    private AddStaticRoute(relativePath: string, alias?: string): void {
        let absolutePath = path.join(this.rootPath, relativePath);

        // if there is no alias, we can assume that this is our wwwroot
        if (typeof alias === "undefined") {
            this.app.use(express.static(absolutePath));
            this.logger.info(" > / -> " + absolutePath);
        } else {
            this.app.use(alias, express.static(absolutePath));
            this.logger.info(" > " + alias + " -> " + absolutePath);
        }
    }

    /**
     * Adds entity route collections which represent our REST-API
     */
    private AddApiRoutes(): void {
        // Adding route collection example
        let thingRoutes = new ThingRouteCollection(this.app);
        this.app = thingRoutes.ApplyRoutes();
    }

    //#endregion
}