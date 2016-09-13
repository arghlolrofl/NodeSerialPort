namespace FP.NavigatorWeb.Common {

    export class String8Bit {

        //#region members
        private m_Text: string;
        //#endregion

        //#region properties 
        get Text(): string { return this.m_Text; }
        set Text(value: string) { this.m_Text = value; }
        //#endregion

        //#region constructor
        constructor(stringValue?: string) {
            if (null != stringValue) {
                this.m_Text = stringValue;
            }
        }
        //#endregion
    }
}
