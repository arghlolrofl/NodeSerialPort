import { Injectable, EventEmitter } from '@angular/core';

declare var io: any;


/**
 * WebSocketClientService is being injected into the Angular2 AppComponent
 * (Weight Monitor) and is responsible to establish a WebSocket connection
 * to the Web-Server.
 */
@Injectable()
export class WebsocketClientService {
    // the event being raised when a new weight has been received
    public weightUpdated$: EventEmitter<string>;
    // the socket connection
    private socket: any;

    /**
     * Initializes the event handler and the socket client
     * 
     * @param {WebSocketConfigurationService} config Application settings provider
     */
    constructor() {
        this.weightUpdated$ = new EventEmitter<string>();

        this.socket = io("http://10.34.2.57:55667");
        this.socket.on('weightUpdate', function (data: string) {
            this.weightUpdated$.emit(data);
        }.bind(this));
    }
}