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
var core_1 = require("@angular/core");
/**
 * WebSocketClientService is being injected into the Angular2 AppComponent
 * (Weight Monitor) and is responsible to establish a WebSocket connection
 * to the Web-Server.
 */
var WebsocketClientService = (function () {
    /**
     * Initializes the event handler and the socket client
     *
     * @param {WebSocketConfigurationService} config Application settings provider
     */
    function WebsocketClientService() {
        this.weightUpdated$ = new core_1.EventEmitter();
        this.socket = io("http://10.34.2.57:55667");
        this.socket.on("weightUpdate", function (data) {
            this.weightUpdated$.emit(data);
        }.bind(this));
    }
    WebsocketClientService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], WebsocketClientService);
    return WebsocketClientService;
}());
exports.WebsocketClientService = WebsocketClientService;
//# sourceMappingURL=app.websocket.client.service.js.map