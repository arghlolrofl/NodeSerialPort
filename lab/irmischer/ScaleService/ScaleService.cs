using ScaleService.Contracts;
using System;
using System.ServiceModel;
using System.ServiceModel.Channels;

namespace ScaleService
{
    public class ScaleService : IScaleService
    {
        private static IScaleServiceCallback sm_Callback;
        internal static IScaleServiceCallback CallbackInstance
        {
            get { return sm_Callback; }
        }

        public ScaleService()
        {
            sm_Callback = OperationContext.Current.GetCallbackChannel<IScaleServiceCallback>();
        }

        public void SendToServer(Message msg)
        {
            Console.WriteLine("Processing Request ...");

            // Check if msg is empty or websocket connection is still opened
            if (msg.IsEmpty)
            {
                Console.WriteLine("Message is empty!");
                return;
            }

            if (((IChannel)sm_Callback).State != CommunicationState.Opened)
            {
                Console.WriteLine("ERROR: WebSocket connection is no longer opened!");
                return;
            }
        }
    }
}
