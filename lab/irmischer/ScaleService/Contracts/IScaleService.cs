using System.ServiceModel;
using System.ServiceModel.Channels;

namespace ScaleService.Contracts
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the interface name "IService1" in both code and config file together.
    [ServiceContract(CallbackContract = typeof(IScaleServiceCallback))]
    public interface IScaleService
    {
        [OperationContract(IsOneWay = true, Action = "*")]
        void SendToServer(Message msg);
    }
}
