using System.ServiceModel;
using System.ServiceModel.Channels;
using System.Threading.Tasks;

namespace ScaleService.Contracts
{
    [ServiceContract]
    public interface IScaleServiceCallback
    {
        [OperationContract(IsOneWay = true, Action = "*")]
        Task SendToClient(Message message);
    }
}