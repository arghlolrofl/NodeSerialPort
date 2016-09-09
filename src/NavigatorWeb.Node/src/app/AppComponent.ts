import { Component, OnInit, ChangeDetectorRef } from "@angular/core";

import { WebSocketClientService } from "./services/WebSocketClientService";
import { EventNames } from "./EventNames";
import { MessageIdentifier } from "./../common/MessageIds";

declare var Waves: any;
declare var $: any;

@Component({
    providers: [
        WebSocketClientService
    ],
    selector: "navigator-web",
    templateUrl: "views/AppComponent.html",
})
export class AppComponent implements OnInit {
    private interval: any;
    private ref: ChangeDetectorRef;
    private webSocketClientService: WebSocketClientService;

    private logText: string = "";
    private canConnect: boolean = true;

    // service gets injected
    constructor(webSocketClientService: WebSocketClientService, cdRef: ChangeDetectorRef) {
        this.ref = cdRef;
        this.webSocketClientService = webSocketClientService;
    }

    public ngOnInit(): void {
        this.webSocketClientService.Events.on(
            EventNames.WebSocketClientService.MESSAGE_RECEIVED,
            (msg: string) => {
                this.log(msg);
            }
        );
        this.webSocketClientService.Events.on(
            EventNames.WebSocketClientService.DATA_RECEIVED,
            (data: Int8Array) => {
                this.processData(data);
            }
        );
        this.webSocketClientService.Events.on(
            EventNames.WebSocketClientService.DEVICE_CONNECTION_STATUS_CHANGE_RECEIVED,
            (isDeviceConnected: boolean) => {
                this.displayConnectionStatus(isDeviceConnected);
            }
        );
        this.webSocketClientService.Events.on(
            EventNames.WebSocketClientService.SERVER_ERROR_RECEIVED,
            (err: Error) => {
                this.processError(err);
            }
        );
        
        this.log("Connecting to WebSocket server ...");
        this.webSocketClientService.connect();
    }

    public connect() {
        this.canConnect = false;
        this.log("Connecting to device ...");
        this.webSocketClientService.request("connect");
    }

    public disconnect() {
        this.log("Disconnecting from device ...");
        this.webSocketClientService.request("disconnect");
        this.canConnect = true;
    }

    private processData(data: Int8Array) {
        let desc = MessageIdentifier.GetStringById(data[1]);
        this.log("Received data [" + data.byteLength + "]: " + desc);
    }

    private log(message: string) {        
        this.logText += message + "\r\n";
    }

    private displayConnectionStatus(isConnected: boolean) {
        if (isConnected) {
            $("#status-container .connection-status")
                .removeClass("red")
                .addClass("green");

            this.canConnect = false;
        } else {
            $("#status-container .connection-status")
                .removeClass("green")
                .addClass("red");

            this.canConnect = true;
        }
    }

    private processError(err: Error) {
        this.log("[ERROR] " + err.message);
        console.error(err);
    }
}
