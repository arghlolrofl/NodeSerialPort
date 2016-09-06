"use strict";
/**
 * Global configuration service containing WebSocket server and
 * client configuration.
 */
var ConfigurationService = (function () {
    /**
     * Instantiates a new instance of the WebSocketConfigurationService
     */
    function ConfigurationService() {
        this.WebSocketClientConfiguration = new NodeWebSocketClientConfiguration();
        this.WebSocketServerConfiguration = new NodeWebSocketServerConfiguration();
        this.WebServerConfiguration = new NodeExpressWebServerConfiguration();
    }
    return ConfigurationService;
}());
exports.ConfigurationService = ConfigurationService;
/**
 * Web Server settings
 */
var NodeExpressWebServerConfiguration = (function () {
    function NodeExpressWebServerConfiguration() {
        this.PORT = 3000;
    }
    return NodeExpressWebServerConfiguration;
}());
exports.NodeExpressWebServerConfiguration = NodeExpressWebServerConfiguration;
/**
 * Node WebSocket client settings
 */
var NodeWebSocketClientConfiguration = (function () {
    function NodeWebSocketClientConfiguration() {
        this.PORT = 55666;
        this.PATH = "scale";
        this.HOST = "10.34.2.110";
        this.URL = "http://" + this.HOST + ":" + this.PORT + "/" + this.PATH;
    }
    return NodeWebSocketClientConfiguration;
}());
exports.NodeWebSocketClientConfiguration = NodeWebSocketClientConfiguration;
/**
 * Node WebSocket server settings
 */
var NodeWebSocketServerConfiguration = (function () {
    function NodeWebSocketServerConfiguration() {
        this.PORT = 55667;
        this.HOST = "10.34.2.57";
        this.URL = "http://" + this.HOST + ":" + this.PORT;
    }
    return NodeWebSocketServerConfiguration;
}());
exports.NodeWebSocketServerConfiguration = NodeWebSocketServerConfiguration;
//# sourceMappingURL=node.config.js.map