using FP.PhoenixClient.Common.Interfaces;
using FP.PhoenixClient.Scales.ExcelScale;
using FP.PhoenixClient.Scales.Interfaces;
using System;
using System.Diagnostics;

namespace ScaleService.Scale
{
    internal class ExcelScaleMonitor
    {
        private const string VENDOR_ID = "2311";
        private const string PRODUCT_ID = "0601";
        private const string REVISION_ID = "0100";

        private IScale m_ExcelScale;
        private IUsbDeviceManager m_UsbDeviceManager;

        internal event EventHandler<ScaleWeightChangedEventArgs> WeightChanged;
        private void RaiseWeightChanged(ScaleWeightChangedEventArgs e) => WeightChanged?.Invoke(this, e);

        public ExcelScaleMonitor()
        {
            IntPtr consoleWindowHandle = Process.GetCurrentProcess().MainWindowHandle;

            m_UsbDeviceManager = new UsbDeviceManager(true);
            m_UsbDeviceManager.ConnectionStatusChanged += UsbDeviceManager_OnConnectionStatusChanged;

            m_ExcelScale = m_UsbDeviceManager.Initialize(consoleWindowHandle, VENDOR_ID, PRODUCT_ID, REVISION_ID) as IScale;
            m_ExcelScale.WeightChanged += Scale_OnWeightChanged;
        }

        private void Scale_OnWeightChanged(object sender, ScaleWeightChangedEventArgs e)
        {
            Console.WriteLine($"[{e.Scale.DeviceId}] Weight: {e.Weight}");
            RaiseWeightChanged(e);
        }

        private void UsbDeviceManager_OnConnectionStatusChanged(object sender, UsbDeviceStatusEventArgs e)
        {
            Console.WriteLine($"[{e.UsbDevice.DeviceId}] Connected: {e.IsConnected}");
        }
    }
}
