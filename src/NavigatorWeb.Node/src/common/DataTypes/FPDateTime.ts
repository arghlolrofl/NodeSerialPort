namespace FP.NavigatorWeb.Common
{
    export class FPDateTime
    {
        //#region members
        private m_Date: FP.NavigatorWeb.Common.FPDate;
        private m_Time: FP.NavigatorWeb.Common.FPTime;
        //#endregion

        //#region properties 
        get Date(): FP.NavigatorWeb.Common.FPDate { return this.m_Date; }
        set Date(value: FP.NavigatorWeb.Common.FPDate) { this.m_Date = value; }

        get Time(): FP.NavigatorWeb.Common.FPTime { return this.m_Time; }
        set Time(value: FP.NavigatorWeb.Common.FPTime) { this.m_Time = value; }
        //#endregion

        //#region constructor
        constructor(date?: Date)
        {
            if (null != date) {
                this.m_Date = new FP.NavigatorWeb.Common.FPDate(date);
                this.Time = new FP.NavigatorWeb.Common.FPTime(date);
            }
        }
        //#endregion

        //#region methods

        public ToDateTime() : Date
        {
            if (this.m_Date.DateIsValid())
            {
                return new Date(this.m_Date.Year.Number, this.m_Date.Month.Number, this.m_Date.Day.Number,
                    this.m_Time.Hour.Number, this.Time.Minute.Number, this.Time.Second.Number);
            }
            return new Date(Date.now());
        }
        //#endregion
    }
}
