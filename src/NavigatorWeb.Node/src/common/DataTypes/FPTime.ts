namespace FP.NavigatorWeb.Common
{
    export class FPTime
    {
        //#region members
        private m_Hour: UNumber16Bit;
        private m_Minute: UNumber16Bit;
        private m_Second: UNumber16Bit;
        //#endregion

        //#region properties 
        get Hour(): UNumber16Bit { return this.m_Hour; }
        set Hour(value: UNumber16Bit) { this.m_Hour = value; }

        get Minute(): UNumber16Bit { return this.m_Minute; }
        set Minute(value: UNumber16Bit) { this.m_Minute = value; }

        get Second(): UNumber16Bit { return this.m_Second; }
        set Second(value: UNumber16Bit) { this.m_Second = value; }
        //#endregion

        //#region constructor
        constructor(date?: Date)
        {
            if (null != date) {
                this.m_Hour = new UNumber16Bit(date.getHours());
                this.Minute = new UNumber16Bit(date.getMinutes());
                this.Second = new UNumber16Bit(date.getSeconds());
            }
        }
        //#endregion
    }
}
