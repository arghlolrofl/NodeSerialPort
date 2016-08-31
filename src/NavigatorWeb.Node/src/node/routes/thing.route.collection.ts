/// <reference path="../../../typings/index.d.ts" />

import * as express from 'express';


export class ThingRouteCollection {
    private app: express.Application;

    constructor(app: express.Application) {
        this.app = app;
    }

    public ApplyRoutes(): express.Application {
        this.applyGetAll();
        this.applyGetSingle();

        return this.app;
    }

    /**
     * GET: /api/thing
     */
    private applyGetAll(): void {
        this.app.get('/thing', function (req: express.Request, res: express.Response, next: express.NextFunction) {
            res.send("LIST OF THINGS (2)");
        });
    }

    /**
     * GET: /api/thing/{thing_id}
     */
    private applyGetSingle(): void {        
        this.app.get('/thing/:thing_id', function (req: express.Request, res: express.Response, next: express.NextFunction) {
            var requestParameter: any = req.params;

            res.send("THING DETAILS [" + requestParameter.thing_id + "] (2)");
        });
    }
}