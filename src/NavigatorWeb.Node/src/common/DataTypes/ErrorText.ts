namespace FP.NavigatorWeb.Common {

    export class ErrorText {

        //#region members
        private m_Text: string;
        private m_Group: string;
        //#endregion

        //#region properties 
        get Text(): string { return this.m_Text; }
        set Text(value: string) { this.m_Text = value; }

        get Group(): string { return this.m_Group; }
        set Group(value: string) { this.m_Group = value; }
        //#endregion
    }
}
