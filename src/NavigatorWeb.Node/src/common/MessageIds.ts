export namespace MessageIdentifier {

    let items: { [Identifier: number]: string } = {
        0: "Start",
        /// <summary>
        /// This message send an acknowledge to acknowledge any fm action that is currently waiting to process inside the FM
        /// </summary>
        122: "Common_GenericAck",
        /// <summary>
        /// This message send a text message to the PC for user entertainment.
        /// </summary>
        123: "Common_GenericTextMessage",
        /// <summary>
        /// This message is sent to notify its recipient that the user confirmed an error message so that the recipient can destroy the correspondig message box on his side.
        /// </summary>
        88: "Diagnostics_ConfirmError",
        /// <summary>
        /// 
        /// </summary>
        1: "Diagnostics_Echo",
        /// <summary>
        /// Send information about errors occuring during message authentication.
        /// </summary>
        107: "Diagnostics_MessageAuthenticationFailed",
        /// <summary>
        /// Sends information about errors occuring in the fm to the pc.
        /// </summary>
        66: "Diagnostics_SendError",
        /// <summary>
        /// This message is send in regular intervalls from the pc to the fm to signal to the fm that the usb connection is still alive. If this heartbeat does not arrive in certain intervalls the fm can then react by leaving the "connected mode"
        /// </summary>
        70: "Initialization_ApplicationHeartbeat",
        /// <summary>
        /// Confirms a connection request of a software by sending basic status meter and country variant information.
        /// </summary>
        17: "Initialization_ConfirmConnect",
        /// <summary>
        /// Initializes communication between a pc software and a mailhandler.
        /// </summary>
        18: "Initialization_Connect",
        /// <summary>
        /// Informs the FM that the connection is going to be closed.
        /// </summary>
        81: "Initialization_Disconnect",
        /// <summary>
        /// Ask the Navigator to end the connection.
        /// </summary>
        82: "Initialization_RequestDisconnect",
        /// <summary>
        /// This message is sent when the machine requests a restart, for example after downloading new firmware. In response to this message the Pc application needs to send a Disconnect which, in this case, triggers a restart of the franking machine.
        /// </summary>
        95: "Initialization_RequestRestart",
        /// <summary>
        /// Initializes the message authentication between PC an d FM. The FM sends this message to the PC if message authentication is required transporting FM randomnes used for key derivation. The PC will answer with this message transporting PC randomness used for key derivation. After this initial Handshake all messages shall be signed before being sent.
        /// </summary>
        141: "Initialization_SetMessageAuthentication",
        /// <summary>
        /// When send from the mailhandler to the software this message contains information about the decimal mode of the mailhandler. If send from the pc to the fm it configures the decimal mode of the mailhandler. 
        /// </summary>
        77: "Maintenance_ConfigureDecimalMeter",
        /// <summary>
        /// When sent from the mailhandler to the pc this message reflects the current high postage value setting in the mailhandler. When sent from the pc to the mailhandler it configures the high postage value setting in the fm.
        /// </summary>
        71: "Maintenance_ConfigureHighPostage",
        /// <summary>
        /// When sent from the mailhandler to the pc this message reflects the current low postage value setting in the mailhandler. When sent from the pc to the mailhandler it configures the low postage value setting in the fm.
        /// </summary>
        63: "Maintenance_ConfigureLowPostageWarning",
        /// <summary>
        /// When sent from the mailhandler to the pc this message reflects the current network settings in the mailhandler. When sent from the pc to the mailhandler it configures the network settings in the fm.
        /// </summary>
        74: "Maintenance_ConfigureNetworkSettings",
        /// <summary>
        /// When sent from the mailhandler to the pc this message reflects the current print offset value setting in the mailhandler. When sent from the pc to the mailhandler it configures the print offset value setting in the fm.
        /// </summary>
        76: "Maintenance_ConfigurePrintOffset",
        /// <summary>
        /// send a request to the meter to transmit dx statistics
        /// </summary>
        139: "Maintenance_DxStatisticsRequest",
        /// <summary>
        /// sends dx statistics data to the connected pc program
        /// </summary>
        140: "Maintenance_DxStatisticsResponse",
        /// <summary>
        /// When sent from the mailhandler to the pc this message reflects the setting whether accounts are enabled in the fm or not. When sent from the pc to the mailhandler it configures whther accounts are enabled or not.
        /// </summary>
        61: "Maintenance_EnableCostAccounts",
        /// <summary>
        /// When sent from the mailhandler to the pc this message reflects the current setting whther differential weighing is enabled in the mailhandler. When sent from the pc to the mailhandler it configures this setting in the mailhandler.
        /// </summary>
        58: "Maintenance_EnableDifferentialWeighing",
        /// <summary>
        /// Resets the item counter to zero.
        /// </summary>
        73: "Maintenance_ResetMailpieceCounter",
        /// <summary>
        /// SetParameter is sent by PC to set a list of predefined parameters. Use this message to set country specific options only (i.e. Frankit BZL number)
        /// </summary>
        100: "Maintenance_SetParameterList",
        /// <summary>
        /// 
        /// </summary>
        111: "Printing_AllowPrinting",
        /// <summary>
        /// PES List
        /// </summary>
        152: "Printing_AllPESResponse",
        /// <summary>
        /// Command to FM to delete all BZL data (after successfull printing of BZL list)
        /// </summary>
        126: "Printing_BzlClear",
        /// <summary>
        /// Request data to print BZL list
        /// </summary>
        124: "Printing_BzlListRequest",
        /// <summary>
        /// BZL list items
        /// </summary>
        125: "Printing_BzlListResponse",
        /// <summary>
        /// Clears the 32/MA list in the machine
        /// </summary>
        133: "Printing_DistintoModelloClear",
        /// <summary>
        /// Request for report items to generate a 32/MA report
        /// </summary>
        132: "Printing_DistintoModelloRequest",
        /// <summary>
        /// response to the DistintoModelloRequest message
        /// </summary>
        134: "Printing_DistintoModelloResponse",
        /// <summary>
        /// Issues a high postage warning to the connected pc if the postage selected by the user exceeds the configured high postage limits.
        /// </summary>
        72: "Printing_HighPostageWarning",
        /// <summary>
        /// This message is sent by the fm before printing onto mailpieces or labels is started to signal that no messages, except the StopPrinting message, are being accepted by the meter. This message could be triggered by starting fm motors.
        /// </summary>
        52: "Printing_ImprintStarted",
        /// <summary>
        /// This message is sent by the fm after printing onto mailpieces or labels has finished to signal that all messages are being accepted again by the meter. This message could be triggered by stopping fm motors.
        /// </summary>
        53: "Printing_ImprintStopped",
        /// <summary>
        /// This message is sent from the meter to signal that the remaining postage in the PSD has fallen below the configured low postage setting.
        /// </summary>
        64: "Printing_LowPostageWarning",
        /// <summary>
        /// Trigger a mode change in the FM (SealOnly Mode, Transport Only Mode, Print Numbers Mode a.s.o.)
        /// </summary>
        130: "Printing_ModeChange",
        /// <summary>
        /// Prints the advert only
        /// </summary>
        105: "Printing_PrintAdvertOnly",
        /// <summary>
        /// Prints the prepayment and the advert.
        /// </summary>
        129: "Printing_PrintPrepayment",
        /// <summary>
        /// Selects an advert to be printed onto a mailpiece. 
        /// </summary>
        28: "Printing_SelectAdvert",
        /// <summary>
        /// Selects a cost account that is to be used for accounting the next imprint onto.
        /// </summary>
        60: "Printing_SelectCostAccount",
        /// <summary>
        /// Selects the current product from the hotkey datatype
        /// </summary>
        89: "Printing_SelectProductByHotkey",
        /// <summary>
        /// Selects the current product by the hotkey index
        /// </summary>
        29: "Printing_SelectProductByHotkeyIndex",
        /// <summary>
        /// Selects a text message to be printed onto the next mailpiece.
        /// </summary>
        30: "Printing_SelectSms",
        /// <summary>
        /// Triggers printing a certain number of labels or letters fed by a connected feeder unit.
        /// </summary>
        67: "Printing_StartPrinting",
        /// <summary>
        /// Requests statistics stored in the Fm, these include advert statistics, date ahead statistics and daily indice reports.
        /// </summary>
        137: "Printing_StatisticsRequest",
        /// <summary>
        /// response to the StatisticsRequest Message
        /// </summary>
        138: "Printing_StatisticsResponse",
        /// <summary>
        /// Requests a Stop of the curernt printing operation. The fm should finish the current imprint.
        /// </summary>
        68: "Printing_StopPrinting",
        /// <summary>
        /// 
        /// </summary>
        153: "Printing_SyncCurrentPESSettings",
        /// <summary>
        /// Synchronizes the currently required customer selection
        /// </summary>
        142: "Printing_SyncRequiredCustomerSelection",
        /// <summary>
        /// Synchronizes the currently valid customer selection
        /// </summary>
        110: "Printing_SyncValidCustomerSelection",
        /// <summary>
        /// This warning indicates that an imprint has already been accounted for in the PSD but, for examüple due to a transport error, the imprint has not been printed onto a mailpiece. The customer needs to be queried whether to print this unused imprint or simply dismiss it, see UnusedImprintWarningResponse
        /// </summary>
        93: "Printing_UnusedImprintWarning",
        /// <summary>
        /// This is the reponse for UnusedImprintWarning that tells the mailhandler how to handle the unused imprint.
        /// </summary>
        94: "Printing_UnusedImprintWarningResponse",
        /// <summary>
        /// When sent from the pc to the mailhandler it configures the current weight setting in the fm. This weight is to be handled by the fm the same way as if it came from the internal scale. From the mailhandler to the pc this behaviour will be indirect realized by the messages SyncProductDescription or UpdateProduct, which contain the current weight as part of the ProductDescription.
        /// </summary>
        31: "Printing_UpdateWeight",
        /// <summary>
        /// 
        /// </summary>
        32: "ProductCalculation_Abort",
        /// <summary>
        /// 
        /// </summary>
        39: "ProductCalculation_Back",
        /// <summary>
        /// 
        /// </summary>
        33: "ProductCalculation_Calculate",
        /// <summary>
        /// The process of the product-calculation will be finished.
        /// </summary>
        85: "ProductCalculation_Finish",
        /// <summary>
        /// This message is being sent from the fm after the last weight has been taken from the internal scale and the machine is currently in differential weighing mode. PC software must respond with whether to use this weight for product calculation or not (LastDifferentialWeightResponse)
        /// </summary>
        112: "ProductCalculation_LastDifferentialWeight",
        /// <summary>
        /// Response message for the LastDifferentialWeight message from the machine.
        /// </summary>
        113: "ProductCalculation_LastDifferentialWeightResponse",
        /// <summary>
        /// 
        /// </summary>
        79: "ProductCalculation_NoProductSelected",
        /// <summary>
        /// This message will be sent, if the user selected the "Test Imprint" button.
        /// </summary>
        84: "ProductCalculation_ProcessTestImprint",
        /// <summary>
        /// 
        /// </summary>
        78: "ProductCalculation_RequestManualPostage",
        /// <summary>
        /// 
        /// </summary>
        131: "ProductCalculation_RequestString",
        /// <summary>
        /// 
        /// </summary>
        34: "ProductCalculation_RequestValue",
        /// <summary>
        /// 
        /// </summary>
        35: "ProductCalculation_SelectIndex",
        /// <summary>
        /// 
        /// </summary>
        36: "ProductCalculation_SelectValue",
        /// <summary>
        /// 
        /// </summary>
        86: "ProductCalculation_ShowDisplay",
        /// <summary>
        /// 
        /// </summary>
        37: "ProductCalculation_ShowMenu",
        /// <summary>
        /// 
        /// </summary>
        38: "ProductCalculation_Start",
        /// <summary>
        /// 
        /// </summary>
        151: "ProductCalculation_SyncLastDynamicProduct",
        /// <summary>
        /// This message will be sent, if the product changes e.g. by a weightchange
        /// </summary>
        87: "ProductCalculation_UpdateProduct",
        /// <summary>
        /// A request send to the PC if additional values are to be queried from the current operator
        /// </summary>
        144: "Remoting_OperatorSelectionRequest",
        /// <summary>
        /// A response sent after a selection has been performed. If send from PC to FM the selection was made at the PC and then sent to the FM. If send from FM to PC the selection was done at the FM and this message simply tells the PC program to hide the selection window and continue normal operation.
        /// </summary>
        145: "Remoting_OperatorSelectionResponse",
        /// <summary>
        /// Triggers a PVD in the mailhandler.
        /// </summary>
        54: "Remoting_PerformPVD",
        /// <summary>
        /// 
        /// </summary>
        154: "Remoting_PerformRemoteServices",
        /// <summary>
        /// This message signals a failed PVD providing detailed error reason and description.
        /// </summary>
        56: "Remoting_PVDFailed",
        /// <summary>
        /// This message signals a succeeded PVD providing a PVD receipt.
        /// </summary>
        55: "Remoting_PVDSucceeded",
        /// <summary>
        /// Message sending a PVD Receipt to the PC. In contrast to the normal PVDSucceeded message additional attributes are being transported here. The purpose is to have a more generic approach to message parameters.
        /// </summary>
        135: "Remoting_PVDSucceededEx",
        /// <summary>
        /// This message requests a reset of all cost account (the item counter and the postage counter of each account is reset to 0)
        /// </summary>
        65: "Synchronization_ClearAllCostAccounts",
        /// <summary>
        /// This message requests a reset of the cost account with the id specified in the parameter. The item counter and the postage counter of this account is reset to 0.
        /// </summary>
        62: "Synchronization_ClearCostAccount",
        /// <summary>
        /// 
        /// </summary>
        148: "Synchronization_ClearOfflineImprints",
        /// <summary>
        /// This message is send by the FM to signal an end to the current progress.
        /// </summary>
        121: "Synchronization_CloseProgress",
        /// <summary>
        /// Configures the time to automatically power off the machine.
        /// </summary>
        96: "Synchronization_ConfigureAutoOff",
        /// <summary>
        /// Configures the standbytime of the machine
        /// </summary>
        97: "Synchronization_ConfigureStandby",
        /// <summary>
        /// 
        /// </summary>
        117: "Synchronization_DeleteUser",
        /// <summary>
        /// 
        /// </summary>
        119: "Synchronization_GeneralSettings",
        /// <summary>
        /// 
        /// </summary>
        118: "Synchronization_Logout",
        /// <summary>
        /// 
        /// </summary>
        116: "Synchronization_ModifyUser",
        /// <summary>
        /// This message is sent to the pc after a mailpiece has been franked. It contains detailed information about the imprint comparable to the old KARAT protocol of older FP-Meters. The information transmitted here is used to keep track of all fm transaction and / or generate versatile reports inside the pc software.
        /// </summary>
        42: "Synchronization_NewImprint",
        /// <summary>
        /// 
        /// </summary>
        150: "Synchronization_SelectCarrier",
        /// <summary>
        /// Updates current progress of any action currently undertaken by the machine
        /// </summary>
        120: "Synchronization_ShowProgress",
        /// <summary>
        /// transmits additional information regarding the currently selected product
        /// </summary>
        143: "Synchronization_SyncAdditionalProductInfo",
        /// <summary>
        /// Synchronizes Blocks of adverts to the pc application
        /// </summary>
        127: "Synchronization_SyncAdvertBlocks",
        /// <summary>
        /// This message is being sent from the fm to the pc to transmit all adverts currently loaded into the fm.
        /// </summary>
        45: "Synchronization_SyncAdverts",
        /// <summary>
        /// Synchronizes available PremiumAdressModes
        /// </summary>
        106: "Synchronization_SyncAvailablePremiumAdressModes",
        /// <summary>
        /// 
        /// </summary>
        149: "Synchronization_SyncCarrier",
        /// <summary>
        /// synchronizes Cost account font information
        /// </summary>
        109: "Synchronization_SyncCostAccountFontData",
        /// <summary>
        /// This message transmits a list of all fm cost accounts.
        /// </summary>
        46: "Synchronization_SyncCostAccountFull",
        /// <summary>
        /// This message transmits a list of cost accounts from the pc to the fm. It is being sent after the user decided to rename one or multiple accounts from inside the pc software. 
        /// </summary>
        47: "Synchronization_SyncCostAccountShort",
        /// <summary>
        /// 
        /// </summary>
        115: "Synchronization_SyncCurrentUser",
        /// <summary>
        /// 
        /// </summary>
        48: "Synchronization_SyncEndorsement",
        /// <summary>
        /// 
        /// </summary>
        92: "Synchronization_SyncHotkeyFontData",
        /// <summary>
        /// This message is used to synchronize the product hotkeys. In the fm these are the 3 (4) hotkeys displayed on the ready mode screen. In Navigator these 3 (4) hotkeys are reflected in the hotkey quick selection panel. On startup the current hotkey selection is being transmitted from the fm to the pc. During runtime the user may want to rename or reorder these hotkeys and then this message is sent from the pc to the fm to sync these hotkeys again.
        /// </summary>
        49: "Synchronization_SyncHotKeys",
        /// <summary>
        /// During an synchronization cycle multiple notices are sent from the mailhandler to the pc software (SyncAdverts, SyncTextMessages a.s.o.). This mesage is the last one being sent signaling the end of the synchronization cycle.
        /// </summary>
        75: "Synchronization_SynchronizationComplete",
        /// <summary>
        /// 
        /// </summary>
        147: "Synchronization_SyncOfflineImprints",
        /// <summary>
        /// This message is being sent from the fm to the pc to transmit all prepayments currently loaded into the fm.
        /// </summary>
        128: "Synchronization_SyncPrepayments",
        /// <summary>
        /// 
        /// </summary>
        90: "Synchronization_SyncPrintDate",
        /// <summary>
        /// 
        /// </summary>
        98: "Synchronization_SyncPrintjobParameter",
        /// <summary>
        /// 
        /// </summary>
        50: "Synchronization_SyncProductDescription",
        /// <summary>
        /// Sends information about the product table loaded by FM
        /// </summary>
        108: "Synchronization_SyncProductTableInfo",
        /// <summary>
        /// Transmits current default PVD settings from the fm to the pc software.
        /// </summary>
        57: "Synchronization_SyncPVDSettings",
        /// <summary>
        /// Synchronizes current Register values
        /// </summary>
        83: "Synchronization_SyncRegister",
        /// <summary>
        /// this method synchronizes extended register parameters like maximum values for certain registers, piece credit or "valid until" dates
        /// </summary>
        136: "Synchronization_SyncRegisterEx",
        /// <summary>
        /// Synchronizes text messages between pc and fm. This message is sent during startup by the fm. If new text messages are added or existing one are edited inside the pc software this message is being sent to the fm to synchronize these lists again.
        /// </summary>
        51: "Synchronization_SyncSms",
        /// <summary>
        /// 
        /// </summary>
        91: "Synchronization_SyncSmsFontData",
        /// <summary>
        /// This message is transmitted to synchronize the sd slot storage provided by the fm that may be used by connected pc software to be used as  storage for settings or other data. It is being sent by the fm during startup. It is being sent by the pc software during a shutdown phase.
        /// </summary>
        69: "Synchronization_SyncStorage",
        /// <summary>
        /// 
        /// </summary>
        114: "Synchronization_SyncUsers",
        /// <summary>
        /// A list with country specific variant settings.
        /// </summary>
        99: "Synchronization_VariantSettings",

        155: "End"
    }

    export function GetStringById(id: number): string {
        return items[id];
    }
}