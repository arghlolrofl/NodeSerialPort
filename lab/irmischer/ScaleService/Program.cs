using ScaleService.Scale;
using ScaleService.WebSockets;
using FP.PhoenixClient.Scales.Interfaces;
using System;

namespace ScaleService
{
    class Program
    {
        private const string WEBSOCKET_ADDRESS = "http://10.34.2.110:55666/scale";

        private static ExcelScaleMonitor sm_ScaleMonitor;
        private static WebSocketServer sm_WebSocketServer;

        static void Main(string[] args)
        {
            sm_ScaleMonitor = new ExcelScaleMonitor();
            sm_ScaleMonitor.WeightChanged += Scale_OnWeightChanged;

            sm_WebSocketServer = new WebSocketServer(WEBSOCKET_ADDRESS);
            sm_WebSocketServer.Run();

            Console.WriteLine($"Websocket server running at: {WEBSOCKET_ADDRESS}");
            Console.ReadLine();
        }

        private static void Scale_OnWeightChanged(object sender, ScaleWeightChangedEventArgs e)
        {
            sm_WebSocketServer.DispatchWeightUpdate(e.Weight);
        }
    }
}
