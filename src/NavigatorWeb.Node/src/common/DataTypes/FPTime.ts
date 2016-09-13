namespace FP.NavigatorWeb.Common
{
    export class FPTime
    {
        //#region members
        private m_Hour: FP.NavigatorWeb.Common.Number16Bit;
        private m_Minute: FP.NavigatorWeb.Common.Number16Bit;
        private m_Second: FP.NavigatorWeb.Common.Number16Bit;
        //#endregion

        //#region properties 
        get Hour(): FP.NavigatorWeb.Common.Number16Bit { return this.m_Hour; }
        set Hour(value: FP.NavigatorWeb.Common.Number16Bit) { this.m_Hour = value; }

        get Minute(): FP.NavigatorWeb.Common.Number16Bit { return this.m_Minute; }
        set Minute(value: FP.NavigatorWeb.Common.Number16Bit) { this.m_Minute = value; }

        get Second(): FP.NavigatorWeb.Common.Number16Bit { return this.m_Second; }
        set Second(value: FP.NavigatorWeb.Common.Number16Bit) { this.m_Second = value; }
        //#endregion

        //#region constructor
        constructor(date?: Date)
        {
            if (null != date) {
                this.m_Hour = new FP.NavigatorWeb.Common.Number16Bit(date.getHours());
                this.Minute = new FP.NavigatorWeb.Common.Number16Bit(date.getMinutes());
                this.Second = new FP.NavigatorWeb.Common.Number16Bit(date.getSeconds());
            }
        }
        //#endregion
    }
}
