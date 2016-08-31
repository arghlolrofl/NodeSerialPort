/**
 * Global configuration service containing WebSocket server and
 * client configuration.
 */
export class ConfigurationService {
    public WebSocketClientConfiguration: NodeWebSocketClientConfiguration;
    public WebSocketServerConfiguration: NodeWebSocketServerConfiguration;
    public WebServerConfiguration: NodeExpressWebServerConfiguration;

    /**
     * Instantiates a new instance of the WebSocketConfigurationService
     */
    constructor() {
        this.WebSocketClientConfiguration = new NodeWebSocketClientConfiguration();
        this.WebSocketServerConfiguration = new NodeWebSocketServerConfiguration();
        this.WebServerConfiguration = new NodeExpressWebServerConfiguration();
    }
}

/**
 * Web Server settings
 */
export class NodeExpressWebServerConfiguration {
    public PORT: number = 3000;
}

/**
 * Node WebSocket client settings
 */
export class NodeWebSocketClientConfiguration {
    public PORT: number = 55666;
    public PATH: string = "scale";
    public HOST: string = "10.34.2.110";
    public URL: string = "http://" + this.HOST + ":" + this.PORT + "/" + this.PATH;
}

/**
 * Node WebSocket server settings
 */
export class NodeWebSocketServerConfiguration {
    public PORT: number = 55667;
    public HOST: string = "10.34.2.57";
    public URL: string = "http://" + this.HOST + ":" + this.PORT;
}