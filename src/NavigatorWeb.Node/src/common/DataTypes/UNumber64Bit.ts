namespace FP.NavigatorWeb.Common {

    export class UNumber64Bit {

        //#region members
        private m_Number: number;
        //#endregion

        //#region properties 
        get Number(): number { return this.m_Number; }
        set Number(value: number) { this.m_Number = value; }
        //#endregion

        //#region constructor
        constructor(numberValue?: number) {
            if (null != numberValue) {
                this.m_Number = numberValue;
            }
        }
        //#endregion
    }
}
