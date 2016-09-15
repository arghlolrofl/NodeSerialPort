namespace FP.NavigatorWeb.Common {

    export enum EErrorType
    {
        /// <summary>
        /// Standard Error
        /// </summary>
        StandardError,

        /// <summary>
        /// Transport Error
        /// </summary>
        TransportError
    }

    export class ErrorInfo {

        //#region members
        private m_Code: UNumber32Bit;
        private m_SubCode1: UNumber32Bit;
        private m_SubCode2: UNumber32Bit;
        //#endregion

        //#region properties 
        get Code(): UNumber32Bit { return this.m_Code; }
        set Code(value: UNumber32Bit) { this.m_Code = value; }

        get SubCode1(): UNumber32Bit { return this.m_SubCode1; }
        set SubCode1(value: UNumber32Bit) { this.m_SubCode1 = value; }

        get SubCode2(): UNumber32Bit { return this.m_SubCode2; }
        set SubCode2(value: UNumber32Bit) { this.m_SubCode2 = value; }
        //#endregion
    }
}
