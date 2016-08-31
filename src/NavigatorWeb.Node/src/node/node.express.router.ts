/// <reference path="../../typings/index.d.ts" />

import * as express from 'express';
import * as path from 'path';

import { ThingRouteCollection } from './routes/thing.route.collection';

export class NodeExpressRouter {
    private app: express.Application;
    private logger: any;

    public rootDir: string;


    constructor(app: express.Application, logger: any) {
        this.app = app;
        this.logger = logger;
        this.rootDir = path.join(__dirname, '/..')
    }

    public ApplyRoutes(): express.Application {
        this.AddStaticRoute('/public');
        this.AddStaticRoute('/node_modules/@angular', '/@angular');
        this.AddStaticRoute('/node_modules/rxjs', '/rxjs');
        this.AddStaticRoute('/node_modules/node-waves/dist', '/waves');

        this.AddApiRoutes();

        return this.app;
    }

    private AddStaticRoute(relativePath: string, alias?: string): void {
        var absolutePath = path.join(this.rootDir, relativePath);

        // if there is no alias, we can assume that this is our wwwroot
        if (typeof alias === 'undefined') {
            this.app.use(express.static(absolutePath));
            this.logger.info(" > / -> " + absolutePath);
        } else {
            this.app.use(alias, express.static(absolutePath));
            this.logger.info(" > " + alias + " -> " + absolutePath);
        }
    }

    private AddApiRoutes(): void {
        let thingRoutes = new ThingRouteCollection(this.app);
        this.app = thingRoutes.ApplyRoutes();
    }
}