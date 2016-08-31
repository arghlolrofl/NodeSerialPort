using System;
using System.ServiceModel.Channels;
using System.Text;

namespace ScaleService.WebSockets
{
    public class MessageUtilities
    {
        internal static string GetChannelMessageContent(Message msg)
        {
            byte[] param = msg.GetBody<byte[]>();
            return Encoding.UTF8.GetString(param);
        }

        internal static Message CreateChannelMessage(string content)
        {
            byte[] byteContent = Encoding.UTF8.GetBytes(content);

            ArraySegment<byte> buffer = new ArraySegment<byte>(byteContent);

            Message msg = ByteStreamMessage.CreateMessage(buffer);

            WebSocketMessageProperty textProperty = new WebSocketMessageProperty();
            textProperty.MessageType = System.Net.WebSockets.WebSocketMessageType.Text;

            msg.Properties.Add("WebSocketMessageProperty", textProperty);

            return msg;
        }
    }
}
