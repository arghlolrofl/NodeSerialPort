export namespace Configuration {
    /**
     * Serial connection configuration settings
     */
    export class Serial {
        private static heartbeatInterval: number;
        /**
         * Port of the web server created by the express framework
         */
        public static get HeartbeatInterval(): number { return Serial.heartbeatInterval; }

        private static portName: string;
        /**
         * Port name of the serial port to connect to, e.g.: "COM7" or "/dev/ttyACM0"
         */
        public static get PortName(): string { return Serial.portName; }

        private static baudRate: number;
        /**
         * Desired baud rate for the serial connection
         */
        public static get BaudRate(): number { return Serial.baudRate; }

        /**
         * Static constructor
         */
        private static _constructor = (() => {
            Serial.heartbeatInterval = 7500;
            Serial.baudRate = 115200;

            // For now, we will check the architecture to determine the serial port name
            if (process.arch === "arm") {
                // If running on arm architecture, we can assume for now, that we
                // are running on linux (raspbian).
                Serial.portName = "/dev/ttyACM0";
            } else {
                // If not running on arm, we will assume, that we are running on
                // the dev machine (windows)
                Serial.portName = "COM7";
            }
        })();
    }
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
            // Adjust the port the web server is listening on here
            WebServer.port = 3000;
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
            WebSocketServer.port = 55667;
            WebSocketServer.host = "10.34.2.59";
        })();
    }
}