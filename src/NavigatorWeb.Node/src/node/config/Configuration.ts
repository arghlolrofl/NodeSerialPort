export module Configuration {
    /**
     * WebServer configuration settings
     */
    export class WebServer {
        private static port: number;
        /**
         * Port of the web server created by the express framework
         */
        public static get Port(): number { return WebServer.port; }

        /**
         * Static constructor
         */
        private static _constructor = (() => {
            console.log('Static WebServer constructor');

            // Adjust the port the web server is listening on here
            WebServer.port = 3000;
        })();
    }

    /**
     * WebSocket client connection settings
     */
    export class WebSocketClient {
        private static port: number;
        /**
         * WebSocket client port
         */
        public static get Port(): number { return WebSocketClient.port; }

        private static path: string;
        /**
         * WebSocket client url path
         */
        public static get Path(): string { return WebSocketClient.path; }

        private static host: string;
        /**
         * WebSocket client host
         */
        public static get Host(): string { return WebSocketClient.host; }

        /**
         * WebSocketClient url
         */
        public static get Url(): string {
            return "http://" + WebSocketClient.host + ":" + WebSocketClient.port + "/" + WebSocketClient.path;
        }

        /**
         * Static constructor
         */
        private static _constructor = (() => {
            console.log('Static WebSocketClient constructor');

            WebSocketClient.port = 55666;
            WebSocketClient.path = "scale";
            WebSocketClient.host = "10.34.2.110";
        })();
    }

    /**
     * WebSocket server connection settings
     */
    export class WebSocketServer {
        private static port: number;
        /**
         * WebSocket server port
         */
        public static get Port(): number { return WebSocketServer.port; }

        private static host: string;
        /**
         * WebSocket server host
         */
        public static get Host(): string { return WebSocketServer.host; }

        /**
         * WebSocket server url
         */
        public static get Url(): string {
            return "http://" + WebSocketServer.host + ":" + WebSocketServer.port;
        }

        /**
         * Static constructor
         */
        private static _constructor = (() => {
            console.log('Static WebSocketServer constructor');
                        
            WebSocketServer.port = 55667;
            WebSocketServer.host = "10.34.2.57";
        })();
    }
}