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
    //#region Private Members

    private interval: any;
    private ref: ChangeDetectorRef;
    private webSocketClientService: WebSocketClientService;

    //#endregion

    //#region Interface Bindings

    private logText: string = "";
    private canConnect: boolean = true;
    private canDisconnect: boolean = false;

    //#endregion

    //#region Initialization

    /**
     * Creates a new instance of the AppComponent class
     *
     * @param webSocketClientService The websocket client
     * @param cdRef ChangeDetectorReference (similar to INotifyPropertyChanged)
     */
    constructor(webSocketClientService: WebSocketClientService, cdRef: ChangeDetectorRef) {
        this.ref = cdRef;
        this.webSocketClientService = webSocketClientService;
    }

    /**
     * Event Hook for initialization tasks
     */
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
                if (isDeviceConnected) {
                    this.canConnect = false;
                    this.canDisconnect = true;
                } else {
                    this.canConnect = true;
                    this.canDisconnect = false;
                }
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

    //#endregion

    /**
     * Sends a request to the websocket server to establish
     * a connection to the device.
     */
    public connectToDevice() {
        this.canConnect = false;
        this.log("Connecting to device ...");
        this.webSocketClientService.request("connect");
    }

    /**
     * Sends a request to the websocket server to close
     * the connection to the device.
     */
    public disconnectFromDevice() {
        this.canDisconnect = false;
        this.log("Disconnecting from device ...");
        this.webSocketClientService.request("disconnect");
        this.canConnect = true;
    }

    //#region Helpers

    /**
     * Incoming messages are being process here.
     *
     * @param data Buffer data as Int8Array
     */
    private processData(data: Int8Array) {
        let messageId: number = data[1];
        let desc: string = MessageIdentifier.GetStringById(messageId);
        this.log("Received data [" + data.byteLength + "]: " + desc);
    }

    /**
     * Logs a message to the textarea in the ui.
     *
     * @param message Message to log.
     */
    private log(message: string) {
        this.logText += message + "\r\n";

        let logbox = $(".log-window")[0];
        logbox.scrollTop = logbox.scrollHeight;

        this.ref.detectChanges();
    }

    /**
     * Handles connection status changes.
     *
     * @param isConnected Flag, if the server has an active connection to the device.
     */
    private displayConnectionStatus(isConnected: boolean) {
        if (isConnected) {
            $("#status-container .connection-status")
                .removeClass("red")
                .addClass("green");

            $(".connection-status-label").text("CONNECTED");
        } else {
            $("#status-container .connection-status")
                .removeClass("green")
                .addClass("red");

            $(".connection-status-label").text("DISCONNECTED");
        }
    }

    /**
     * Processes errors that occured on the server side.
     *
     * @param err
     */
    private processError(err: Error) {
        this.log("[ERROR] " + err.message);
        console.error(err);
    }

    //#endregion
}
