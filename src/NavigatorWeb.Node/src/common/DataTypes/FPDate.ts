namespace FP.NavigatorWeb.Common
{
    export class FPDate
    {
        //#region members
        private m_Year: UNumber16Bit;
        private m_Month: UNumber16Bit;
        private m_Day: UNumber16Bit;
        //#endregion

        //#region properties 
        get Year(): UNumber16Bit { return this.m_Year; }
        set Year(value: UNumber16Bit) { this.m_Year = value; }

        get Month(): UNumber16Bit { return this.m_Month; }
        set Month(value: UNumber16Bit) { this.m_Month = value; }

        get Day(): UNumber16Bit { return this.m_Day; }
        set Day(value: UNumber16Bit) { this.m_Day = value; }
        //#endregion

        //#region constructor
        constructor(date?: Date)
        {
            if (null != date) {
                this.m_Year = new UNumber16Bit(date.getFullYear());
                this.Month = new UNumber16Bit(date.getMonth());
                this.Day = new UNumber16Bit(date.getDate());
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
