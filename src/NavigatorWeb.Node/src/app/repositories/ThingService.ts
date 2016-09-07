import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs";

import "rxjs/add/operator/map";
import "rxjs/add/operator/toPromise";

import { IRepositoryService } from "../interfaces/IRepositoryService";
import { Thing } from "../models/Thing";

@Injectable()
export class ThingRepositoryService implements IRepositoryService<Thing> {
    private baseUrl: string = "thing";

    constructor(private http: Http) { }

    public getAll(): Observable<Thing[]> {
        console.log("[SVC] Getting all 'Thing's");

        return this.http.get(this.baseUrl)
            .map((r: Response) => r.json());
    }

    public find(id: number): Observable<Thing> {
        console.log("[SVC] Searching for 'Thing': " + id);

        return this.http.get(this.baseUrl + "/" + id)
            .map((r: Response) => r.json());
    }
}
