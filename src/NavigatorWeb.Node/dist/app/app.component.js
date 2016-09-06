"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
alert("Loading component");
var core_1 = require("@angular/core");
var thing_repository_service_1 = require("./services/thing.repository.service");
var app_websocket_client_service_1 = require("./services/app.websocket.client.service");
var AppComponent = (function () {
    // service gets injected
    function AppComponent(webSocketClientService, thingService, cdRef) {
        this.animationOverallTime = 750;
        this.animationStepTime = 15;
        this.animationStepCount = this.animationOverallTime / this.animationStepTime;
        this.displayedWeightInGrams = 0;
        this.displayedWeightUpdate = "None";
        this.weightString = "None";
        this.weightHistory = [];
        this.thingRepository = thingService;
        this.ref = cdRef;
        this.webSocketClientService = webSocketClientService;
    }
    AppComponent.prototype.ngOnInit = function () {
        // this.thingRepository
        //    .getAll()
        //    .subscribe((data: Thing[]) => this.things = data);
        var _this = this;
        console.log("Initializing waves ...");
        Waves.attach(document.getElementById("scale-image"), ["waves-green"]);
        Waves.init();
        this.webSocketClientService.weightUpdated$.subscribe(function (data) { return _this.onWeightUpdated(data); });
    };
    AppComponent.prototype.onWeightUpdated = function (data) {
        this.weightString = data;
        this.weightHistory.unshift(this.weightString);
        Waves.ripple(".waves-effect");
        this.showStatusMessage();
        if (this.weightString.indexOf("g") >= 0) {
            var grams = this.weightString.substring(0, this.weightString.length - 2);
            this.totalWeightInGrams = +grams;
            var start = 0;
            var inc = this.totalWeightInGrams / this.animationStepCount;
            this.displayedWeightInGrams = 0;
            this.interval = setInterval(this.updateWeightDisplay.bind(this), this.animationStepTime, [inc]);
        }
        setTimeout(this.hideStatusMessage, 3000);
    };
    AppComponent.prototype.updateWeightDisplay = function (params) {
        this.displayedWeightInGrams += params[0];
        if (this.displayedWeightInGrams >= this.totalWeightInGrams) {
            clearInterval(this.interval);
            this.displayedWeightUpdate = this.weightString;
            Waves.calm(".waves-effect");
            // tell ng2 to detect changes: important for some mobile 
            // browsers to update their view after a weight update, e.g.:
            // android native browser, iPad safari browser
            this.ref.detectChanges();
        }
        else {
            this.displayedWeightUpdate = Math.round(this.displayedWeightInGrams) + " g";
        }
    };
    AppComponent.prototype.showStatusMessage = function () {
        var element = $("#weight-status");
        element.fadeIn("slow");
    };
    AppComponent.prototype.hideStatusMessage = function () {
        var element = $("#weight-status");
        element.fadeOut("slow");
    };
    AppComponent = __decorate([
        core_1.Component({
            providers: [
                app_websocket_client_service_1.WebsocketClientService,
                thing_repository_service_1.ThingRepositoryService,
            ],
            selector: "monitor-app",
            templateUrl: "views/app.component.html",
        }), 
        __metadata('design:paramtypes', [app_websocket_client_service_1.WebsocketClientService, thing_repository_service_1.ThingRepositoryService, core_1.ChangeDetectorRef])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map