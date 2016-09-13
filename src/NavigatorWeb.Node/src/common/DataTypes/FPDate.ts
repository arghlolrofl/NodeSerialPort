namespace FP.NavigatorWeb.Common
{
    export class FPDate
    {
        //#region members
        private m_Year: FP.NavigatorWeb.Common.Number16Bit;
        private m_Month: FP.NavigatorWeb.Common.Number16Bit;
        private m_Day: FP.NavigatorWeb.Common.Number16Bit;
        //#endregion

        //#region properties 
        get Year(): FP.NavigatorWeb.Common.Number16Bit { return this.m_Year; }
        set Year(value: FP.NavigatorWeb.Common.Number16Bit) { this.m_Year = value; }

        get Month(): FP.NavigatorWeb.Common.Number16Bit { return this.m_Month; }
        set Month(value: FP.NavigatorWeb.Common.Number16Bit) { this.m_Month = value; }

        get Day(): FP.NavigatorWeb.Common.Number16Bit { return this.m_Day; }
        set Day(value: FP.NavigatorWeb.Common.Number16Bit) { this.m_Day = value; }
        //#endregion

        //#region constructor
        constructor(date?: Date)
        {
            if (null != date) {
                this.m_Year = new FP.NavigatorWeb.Common.Number16Bit(date.getFullYear());
                this.Month = new FP.NavigatorWeb.Common.Number16Bit(date.getMonth());
                this.Day = new FP.NavigatorWeb.Common.Number16Bit(date.getDate());
            }
        }
        //#endregion

        //#region methods

        public ToDateTime() : Date
        {
            if (this.DateIsValid())
            {
                return new Date(this.m_Year.Number, this.m_Month.Number, this.m_Day.Number);
            }
            return new Date(Date.now());
        }

        public DateIsValid() : boolean
        {
            return ((this.m_Year.Number != 0) &&
                (this.m_Month.Number != 0) &&
                (this.m_Month.Number <= 12) &&
                (this.m_Day.Number != 0) &&
                (this.m_Day.Number <= 31));
        }
        //#endregion
    }
}
