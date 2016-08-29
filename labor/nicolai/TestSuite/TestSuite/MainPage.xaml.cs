using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Windows.Devices.Enumeration;
using Windows.Devices.SerialCommunication;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.Storage.Streams;
using Windows.UI;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Documents;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Navigation;

// The Blank Page item template is documented at http://go.microsoft.com/fwlink/?LinkId=402352&clcid=0x409

namespace TestSuite
{
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class MainPage : Page
    {
        #region constants
        private readonly byte[] CONNECT_MESSAGE = { 0, 18, 0, 0, 0, 4, 0, 0, 0, 99 };
        private readonly byte[] DISCONNECT_MESSAGE = { 0, 81, 0, 0, 0, 0};
        #endregion

        #region embedded
        public class ConnectionDisplay
        {
            public SerialDevice SerialDeviceInfo { get; set; }
            public string ComboText { get; set; }

            public ConnectionDisplay(SerialDevice deviceInfo, string text = null)
            {
                SerialDeviceInfo = deviceInfo;
                ComboText = null == text ? deviceInfo.PortName : text;
            }
        }
        #endregion

        #region mebers
        private SerialDevice m_SelectedDevice = null;
        private DataWriter m_DataWriteObject = null;
        private DataReader m_DataReaderObject = null;
        private CancellationTokenSource ReadCancellationTokenSource;
        #endregion

        public MainPage()
        {
            this.InitializeComponent();
            InitCombobox();
        }

        private async void InitCombobox()
        {
            ObservableCollection<ConnectionDisplay> deviceInfos = new ObservableCollection<ConnectionDisplay>();
            var deviceSelector = SerialDevice.GetDeviceSelector();
            var devices = await DeviceInformation.FindAllAsync(deviceSelector);

            foreach (var device in devices)
            {
                var port = await SerialDevice.FromIdAsync(device.Id);
                if (null != port)
                {
                    if (port.UsbVendorId == 0x2311)
                    {
                        deviceInfos.Add(new ConnectionDisplay(port, GetPostBaseName(port.UsbProductId)));
                    }
                    else
                    {
                        deviceInfos.Add(new ConnectionDisplay(port));
                    }
                }
            }
            m_ComboboxPorts.ItemsSource = deviceInfos;
            m_ComboboxPorts.DisplayMemberPath = "ComboText";
        }

        private string GetPostBaseName(ushort productId)
        {
            switch (productId)
            {
                case 0x501:
                    return "PostBase";
                case 0x502:
                    return "PostBaseMini";
                case 0x503:
                    return "PostBase100";
                case 0x504:
                    return "PostBaseOne";
                default:
                    return string.Empty;
            }
        }

        private void m_ButtonOpen_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                m_SelectedDevice = ((ConnectionDisplay)m_ComboboxPorts.SelectedItem)?.SerialDeviceInfo;
                if (null != m_SelectedDevice)
                {
                    // Configure serial settings
                    m_SelectedDevice.WriteTimeout = TimeSpan.FromMilliseconds(2000);
                    m_SelectedDevice.ReadTimeout = TimeSpan.FromMilliseconds(2000);
                    m_SelectedDevice.BaudRate = 115200;
                    m_SelectedDevice.Parity = SerialParity.None;
                    m_SelectedDevice.StopBits = SerialStopBitCount.One;
                    m_SelectedDevice.DataBits = 8;
                    m_SelectedDevice.Handshake = SerialHandshake.None;

                    // Display configured settings
                    AppendLog("Serial port configured successfully: ");
                    string details = $"BaudRate: {m_SelectedDevice.BaudRate} DataBits: {m_SelectedDevice.DataBits} Parity: {m_SelectedDevice.Parity.ToString()} Stopbits: {m_SelectedDevice.StopBits}";
                    AppendLog(details);
                    AppendLog("Waiting for data...");

                    // Create cancellation token object to close I/O operations when closing the device
                    ReadCancellationTokenSource = new CancellationTokenSource();

                    Listen();

                    m_ComboboxPorts.IsEnabled = false;
                    m_ButtonOpen.IsEnabled = false;
                    m_ButtonClose.IsEnabled = true;
                    m_ButtonSendConnect.IsEnabled = m_ButtonSendDisconnect.IsEnabled = true;
                }
            }
            catch(Exception ex)
            {
                AppendLog(ex.Message, new SolidColorBrush(Colors.Red));
            }
        }

        private void m_ButtonClose_Click(object sender, RoutedEventArgs e)
        {
            CloseDevice();
        }

        private void m_ComboboxPorts_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            m_ButtonOpen.IsEnabled = m_ComboboxPorts.SelectedItem != null;
        }

        private async void m_sendConnect_Click(object sender, RoutedEventArgs e)
        {
            //Launch the WriteAsync task to perform the write
            await WriteAsync(CONNECT_MESSAGE, "Connect");
        }

        private async void m_sendDisconnect_Click(object sender, RoutedEventArgs e)
        {
            //Launch the WriteAsync task to perform the write
            await WriteAsync(DISCONNECT_MESSAGE, "Disconnect");
        }

        private void AppendLog(string text, Brush color = null)
        {
            AppendText(m_TextblockLog, $"{DateTime.Now.ToString("hh:mm:ss")}: {text}", color);
        }
        private void AppendText(RichTextBlock block, string text, Brush color = null )
        {
            if(null == color)
            {
                color = new SolidColorBrush(Colors.Black);
            }
            Paragraph p = new Paragraph();
            Run r = new Run();
            r.Text = text;
            r.Foreground = color;
            p.Inlines.Add(r);
            block.Blocks.Add(p);
        }

        private string GetBytesAsString(byte[] bytes)
        {
            string bytesAsString = "[";
            foreach (byte b in bytes)
            {
                bytesAsString += $"{((int)b).ToString()},";
            }
            bytesAsString.Remove(bytesAsString.Length - 1);
            bytesAsString += "]";
            return bytesAsString;
        }

        #region com port methods
        private async Task WriteAsync(byte[] bytes, string messageName)
        {
            Task<UInt32> storeAsyncTask;

            if (bytes.Any())
            {
                try
                {
                    if (m_SelectedDevice != null)
                    {
                        // Create the DataWriter object and attach to OutputStream
                        m_DataWriteObject = new DataWriter(m_SelectedDevice.OutputStream);
                        // Load the text from the sendText input text box to the dataWriter object
                        m_DataWriteObject.WriteBytes (bytes);

                        // Launch an async task to complete the write operation
                        storeAsyncTask = m_DataWriteObject.StoreAsync().AsTask();

                        UInt32 bytesWritten = await storeAsyncTask;
                        if (bytesWritten > 0)
                        {
                            AppendText(m_TextBlockSent, $"{messageName}: {GetBytesAsString(bytes)}");
                            AppendLog("Bytes written successfully!");
                        }
                    }
                    else
                    {
                        AppendLog("Select a device and open", new SolidColorBrush(Colors.Red));
                    }
                }
                catch (Exception ex)
                {
                    AppendLog(ex.Message, new SolidColorBrush(Colors.Red));
                }
                finally
                {
                    // Cleanup once complete
                    if (m_DataWriteObject != null)
                    {
                        m_DataWriteObject.DetachStream();
                        m_DataWriteObject = null;
                    }
                }
            }
        }

        private async void Listen()
        {
            try
            {
                if (m_SelectedDevice != null)
                {
                    m_DataReaderObject = new DataReader(m_SelectedDevice.InputStream);

                    // keep reading the serial input
                    while (true)
                    {
                        await ReadAsync(ReadCancellationTokenSource.Token);
                    }
                }
            }
            catch (Exception ex)
            {
                if (ex.GetType().Name == "TaskCanceledException")
                {
                    AppendLog("Reading task was cancelled, closing device and cleaning up"); ;
                    CloseDevice();
                }
                else
                {
                    AppendLog(ex.Message, new SolidColorBrush(Colors.Red));
                }
            }
            finally
            {
                // Cleanup once complete
                if (m_DataReaderObject != null)
                {
                    m_DataReaderObject.DetachStream();
                    m_DataReaderObject = null;
                }
            }
        }

        private async Task ReadAsync(CancellationToken cancellationToken)
        {
            Task<UInt32> loadAsyncTask;

            uint readBufferLength = 4096 * 1024;

            // If task cancellation was requested, comply
            cancellationToken.ThrowIfCancellationRequested();

            // Set InputStreamOptions to complete the asynchronous read operation when one or more bytes is available
            m_DataReaderObject.InputStreamOptions = InputStreamOptions.Partial;

            // Create a task object to wait for data on the serialPort.InputStream
            loadAsyncTask = m_DataReaderObject.LoadAsync(readBufferLength).AsTask(cancellationToken);

            // Launch the task and wait
            UInt32 bytesRead = await loadAsyncTask;
            if (bytesRead > 0)
            {
                HandleReceivedBytes(bytesRead);
            }
        }

        private void HandleReceivedBytes(uint bytesLeft)
        {
            uint headerLength = sizeof(ushort) + sizeof(uint);
            if (bytesLeft >= headerLength)
            {
                ushort id = m_DataReaderObject.ReadUInt16();
                uint length = m_DataReaderObject.ReadUInt32();
                byte[] payload = new byte[length];
                m_DataReaderObject.ReadBytes(payload);
                AppendText(m_TextBlockReceived, $"Received ID: {id} Length: {length}");
                AppendLog($"{bytesLeft} Bytes read successfully!");

                HandleReceivedBytes(bytesLeft - headerLength - (uint)payload.Length);
            }
        }

        private void CancelReadTask()
        {
            if (ReadCancellationTokenSource != null)
            {
                if (!ReadCancellationTokenSource.IsCancellationRequested)
                {
                    ReadCancellationTokenSource.Cancel();
                }
            }
        }

        private void CloseDevice()
        {
            if (m_SelectedDevice != null)
            {
                m_SelectedDevice.Dispose();
            }
            m_SelectedDevice = null;

            m_ButtonClose.IsEnabled = false;
            m_ButtonOpen.IsEnabled = true;
            m_ComboboxPorts.IsEnabled = true;
            m_ButtonSendConnect.IsEnabled = m_ButtonSendDisconnect.IsEnabled = true;

            m_TextBlockReceived.Blocks.Clear();
            m_TextBlockSent.Blocks.Clear();
        }
        #endregion
    }
}
