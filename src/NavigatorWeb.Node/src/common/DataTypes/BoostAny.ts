namespace FP.NavigatorWeb.Common
{
    export class BoostAny
    {
        //#region members
        private m_Type: EBoostAnyType;
        private m_Value: any;
        //#endregion

        //#region properties
        get Type(): EBoostAnyType { return this.m_Type; }
        set Type(value: EBoostAnyType) { this.m_Type = value; }

        get Value(): any { return this.m_Value; }
        set Value(value: any) { this.m_Value = value; }

        get ValueOfNumber32Bit(): FP.NavigatorWeb.Common.Number32Bit {
            if (this.m_Type == EBoostAnyType.INT32) {
                return this.m_Value;
            }
            return new Number32Bit(0);
        }
        set ValueOfNumber32Bit(value: FP.NavigatorWeb.Common.Number32Bit) {
            this.m_Type = EBoostAnyType.INT32;
            this.m_Value = value;
        }

        get ValueOfUNumber32Bit(): FP.NavigatorWeb.Common.UNumber32Bit {
            if (this.m_Type == EBoostAnyType.UINT32) {
                return this.m_Value;
            }
            return new UNumber32Bit(0);
        }
        set ValueOfUNumber32Bit(value: FP.NavigatorWeb.Common.UNumber32Bit) {
            this.m_Type = EBoostAnyType.UINT32;
            this.m_Value = value;
        }

        get ValueOfNumber16Bit(): FP.NavigatorWeb.Common.Number16Bit {
            if (this.m_Type == EBoostAnyType.INT16) {
                return this.m_Value;
            }
            return new Number16Bit(0);
        }
        set ValueOfNumber16Bit(value: FP.NavigatorWeb.Common.Number16Bit) {
            this.m_Type = EBoostAnyType.INT16;
            this.m_Value = value;
        }

        get ValueOfUNumber16Bit(): FP.NavigatorWeb.Common.UNumber16Bit {
            if (this.m_Type == EBoostAnyType.UINT16) {
                return this.m_Value;
            }
            return new UNumber16Bit(0);
        }
        set ValueOfUNumber16Bit(value: FP.NavigatorWeb.Common.UNumber16Bit) {
            this.m_Type = EBoostAnyType.UINT16;
            this.m_Value = value;
        }

        get ValueOfNumber64Bit(): FP.NavigatorWeb.Common.Number64Bit {
            if (this.m_Type == EBoostAnyType.INT64) {
                return this.m_Value;
            }
            return new Number64Bit(0);
        }
        set ValueOfNumber64Bit(value: FP.NavigatorWeb.Common.Number64Bit) {
            this.m_Type = EBoostAnyType.INT64;
            this.m_Value = value;
        }

        get ValueOfUNumber64Bit(): FP.NavigatorWeb.Common.UNumber64Bit {
            if (this.m_Type == EBoostAnyType.UINT64) {
                return this.m_Value;
            }
            return new UNumber64Bit(0);
        }
        set ValueOfUNumber64Bit(value: FP.NavigatorWeb.Common.UNumber64Bit) {
            this.m_Type = EBoostAnyType.UINT64;
            this.m_Value = value;
        }

        get ValueOfBoolean(): boolean {
            if (this.m_Type == EBoostAnyType.BOOLEAN) {
                return this.m_Value;
            }
            return false;
        }
        set ValueOfBoolean(value: boolean) {
            this.m_Type = EBoostAnyType.BOOLEAN;
            this.m_Value = value;
        }

        get ValueOfString(): string {
            if (this.m_Type == EBoostAnyType.STRING) {
                return this.m_Value;
            }
            return "";
        }
        set ValueOfString(value: string) {
            this.m_Type = EBoostAnyType.STRING;
            this.m_Value = value;
        }
        //#endregion

        //#region constructor
        constructor(type?: EBoostAnyType, value?: any)
        {
            if (null != type && null != value) {
                this.m_Type = type;
                this.m_Value = value;
            }
            else
            {
                this.m_Type = EBoostAnyType.UNDEFINED;
                this.m_Value = "Undefinde BoostAnyType";
            }

        }
        //#endregion

        //#region methods
        /// <summary>
        /// Creates the new type of the value.
        /// </summary>
        private CreateNewValueOfType(): void
        {
            switch (this.m_Type)
            {
                case EBoostAnyType.INT32:
                    {
                        this.m_Value = new FP.NavigatorWeb.Common.Number32Bit(0);
                    }
                    break;

                case EBoostAnyType.UINT32:
                    {
                        this.m_Value = new FP.NavigatorWeb.Common.UNumber32Bit(0);
                    }
                    break;

                case EBoostAnyType.INT16:
                    {
                        this.m_Value = new FP.NavigatorWeb.Common.Number16Bit(0);
                    }
                    break;

                case EBoostAnyType.UINT16:
                    {
                        this.m_Value = new FP.NavigatorWeb.Common.UNumber16Bit(0);
                    }
                    break;

                case EBoostAnyType.UINT64:
                    {
                        this.m_Value = new FP.NavigatorWeb.Common.UNumber64Bit(0);
                    }
                    break;

                case EBoostAnyType.INT64:
                    {
                            this.m_Value = new FP.NavigatorWeb.Common.Number64Bit(0);
                    }
                    break;

                case EBoostAnyType.BOOLEAN:
                    {
                        this.m_Value = false;
                    }
                    break;

                case EBoostAnyType.STRING:
                    {
                        this.m_Value = "Boost Any String";
                    }
                    break;

                case EBoostAnyType.BITMAP_RAWFORMAT:
                    {
                        //not implemented
                    }
                    break;

                case EBoostAnyType.UNDEFINED:
                    {
                        this.m_Value = "Undefined BoostAnyType";
                    }
                    break;

                default:
                    {
                        throw new Error("BoostAny>>CopyConstructor:BoostType is not yet implemented: " + this.m_Type);
                    }
        }
    }
        //#endregion
    }

    export enum EBoostAnyType
    {
        /// <summary>
        /// Undefined type
        /// </summary>
        UNDEFINED,
        /// <summary>
        /// INT32 like System.Int32
        /// </summary>
        INT32,
        /// <summary>
        /// UINT32 like System.UInt32
        /// </summary>
        UINT32,
        /// <summary>
        /// STRING like System.String
        /// </summary>
        STRING,
        /// <summary>
        /// BITMAP_RAWFORMAT like System.Drawing.Image in a raw byteformat
        /// </summary>
        BITMAP_RAWFORMAT,
        /// <summary>
        /// INT16 like System.Int16
        /// </summary>
        INT16,
        /// <summary>
        /// UINT16 like System.UInt16
        /// </summary>
        UINT16,
        /// <summary>
        /// BOOLEAN like System.Boolean
        /// </summary>
        BOOLEAN,
        /// <summary>
        /// UINT64 like System.UInt64
        /// </summary>
        UINT64,
        /// <summary>
        /// INT64 like System.Int64
        /// </summary>
        INT64
    }
}