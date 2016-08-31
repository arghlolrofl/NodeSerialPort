using ScaleService.Contracts;
using FP.PhoenixClient.Scales.Interfaces;
using System;
using System.Diagnostics;
using System.ServiceModel;
using System.ServiceModel.Channels;
using System.ServiceModel.Description;

namespace ScaleService.WebSockets
{
    internal class WebSocketServer : IDisposable
    {
        private Uri m_BaseAddress;
        private ServiceHost m_ServiceHost;

        public WebSocketServer(string baseAddress)
        {
            m_BaseAddress = new Uri(baseAddress);
        }

        internal void Run()
        {
            if (m_ServiceHost == null || m_ServiceHost.State != CommunicationState.Opened)
            {
                m_ServiceHost = new ServiceHost(typeof(ScaleService), m_BaseAddress);

                // Enable metadata publishing.
                ServiceMetadataBehavior smb = new ServiceMetadataBehavior();
                smb.HttpGetEnabled = true;
                smb.MetadataExporter.PolicyVersion = PolicyVersion.Policy15;
                m_ServiceHost.Description.Behaviors.Add(smb);


                CustomBinding binding = new CustomBinding();
                binding.Elements.Add(new ByteStreamMessageEncodingBindingElement());
                HttpTransportBindingElement transport = new HttpTransportBindingElement();
                transport.WebSocketSettings.TransportUsage = WebSocketTransportUsage.Always;
                transport.WebSocketSettings.CreateNotificationOnConnection = true;
                binding.Elements.Add(transport);

                m_ServiceHost.AddServiceEndpoint(typeof(IScaleService), binding, "");
                m_ServiceHost.Open();
            }
        }

        internal void DispatchWeightUpdate(IWeight newWeight)
        {
            Debug.WriteLine("Attempting to update client ...");
            if (ScaleService.CallbackInstance != null)
            {
                ScaleService.CallbackInstance.SendToClient(MessageUtilities.CreateChannelMessage(newWeight.ToString()));
                Debug.WriteLine("... done!");
            }
            else
                Debug.WriteLine("... failed!");
        }

        public void Dispose()
        {
            m_ServiceHost.Close();
            m_ServiceHost = null;
        }
    }
}
