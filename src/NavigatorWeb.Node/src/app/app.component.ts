alert("Loading component");

import { Component, OnInit, ChangeDetectorRef } from "@angular/core";

import { Thing } from "./models/thing.entity";
import { ThingRepositoryService } from "./services/thing.repository.service";
import { WebsocketClientService } from './services/app.websocket.client.service';

declare var Waves: any;
declare var $: any;

@Component({
    providers: [
        WebsocketClientService,
        ThingRepositoryService,
    ],
    selector: "monitor-app",
    templateUrl: "views/app.component.html",
})
export class AppComponent implements OnInit {
    private animationOverallTime: number = 750;
    private animationStepTime: number = 15;
    private animationStepCount: number = this.animationOverallTime / this.animationStepTime;

    private totalWeightInGrams: number;
    private displayedWeightInGrams: number = 0;
    private displayedWeightUpdate: string = "None";

    private weightString: string = "None";
    private weightHistory: Array<string>;

    private webSocketClientService: WebsocketClientService;

    interval: any;
    ref: ChangeDetectorRef;

    public things: Array<Thing>;

    private thingRepository: ThingRepositoryService;

    // service gets injected
    constructor(webSocketClientService: WebsocketClientService, thingService: ThingRepositoryService, cdRef: ChangeDetectorRef) {
        this.weightHistory = [];
        this.thingRepository = thingService;
        this.ref = cdRef;
        this.webSocketClientService = webSocketClientService;
    }

    public ngOnInit(): void {
        //this.thingRepository
        //    .getAll()
        //    .subscribe((data: Thing[]) => this.things = data);

        console.log("Initializing waves ...");

        Waves.attach(document.getElementById('scale-image'), ['waves-green']);
        Waves.init();

        this.webSocketClientService.weightUpdated$.subscribe((data: string) => this.onWeightUpdated(data));
    }

    onWeightUpdated(data: string) {
        this.weightString = data;
        this.weightHistory.unshift(this.weightString);

        Waves.ripple('.waves-effect');
        this.showStatusMessage();

        if (this.weightString.indexOf("g") >= 0) {
            let grams: string = this.weightString.substring(0, this.weightString.length - 2);
            this.totalWeightInGrams = +grams;

            let start: number = 0;
            let inc: number = this.totalWeightInGrams / this.animationStepCount;

            this.displayedWeightInGrams = 0;
            this.interval = setInterval(this.updateWeightDisplay.bind(this), this.animationStepTime, [inc]);
        }

        setTimeout(this.hideStatusMessage, 3000);
    }

    updateWeightDisplay(params: Array<number>) {
        this.displayedWeightInGrams += params[0];

        if (this.displayedWeightInGrams >= this.totalWeightInGrams) {

            clearInterval(this.interval);
            this.displayedWeightUpdate = this.weightString;
            Waves.calm('.waves-effect');

            //tell ng2 to detect changes: important for some mobile 
            //browsers to update their view after a weight update, e.g.:
            //android native browser, iPad safari browser
            this.ref.detectChanges();

        } else {
            this.displayedWeightUpdate = Math.round(this.displayedWeightInGrams) + " g";
        }
    }

    showStatusMessage(): void {
        let element = $('#weight-status');
        element.fadeIn("slow");
    }

    hideStatusMessage(): void {
        let element = $('#weight-status');
        element.fadeOut("slow");
    }
}
