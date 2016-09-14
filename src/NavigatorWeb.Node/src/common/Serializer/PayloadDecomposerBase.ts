namespace FP.NavigatorWeb.Common.Serializer
{
    export abstract class PayloadDecomposerBase
    {
        //#region constants
        private IS_LITTLE_ENDIAN: boolean = true;
        //#endregion

        //#region members
        private m_RawPayloadBuffer: ArrayBuffer;
        protected m_PayloadPositionPointer: number;
        //#endregion

        //#region constructors
        constructor(rawPayloadBuffer: ArrayBuffer)
        {
            this.m_RawPayloadBuffer = rawPayloadBuffer;
        }
        //#endregion

        //#region methods

        /// <summary>
        /// Extracts the next property as Int16.
        /// </summary>
        /// <returns></returns>
        public ExtractNextPropertyAsNumber16Bit(): Number16Bit
        {
            const TYPE_SIZE = 2;

            var numberValue = new DataView(this.m_RawPayloadBuffer, this.m_PayloadPositionPointer, TYPE_SIZE).getInt16(0, this.IS_LITTLE_ENDIAN);
            this.m_PayloadPositionPointer += TYPE_SIZE;
            return new Number16Bit(numberValue);
        }

        /// <summary>
        /// Extracts the next property as int32.
        /// </summary>
        /// <returns></returns> 
        public ExtractNextPropertyAsNumber32Bit(): Number32Bit
        {
            const TYPE_SIZE = 4;

            var numberValue = new DataView(this.m_RawPayloadBuffer, this.m_PayloadPositionPointer, TYPE_SIZE).getInt32(0, this.IS_LITTLE_ENDIAN);
            this.m_PayloadPositionPointer += TYPE_SIZE;
            return new Number32Bit(numberValue);
        }

        /// <summary>
        /// Extracts the next property as int64.
        /// </summary>
        /// <returns></returns> 
        public ExtractNextPropertyAsNumber64Bit(): Number64Bit
        {
            throw new Error("Not implemented");
        }

        /// <summary>
        /// Extracts the next property as byte array.
        /// </summary>
        /// <returns></returns> 
        public ExtractNextPropertyAsArrayBuffer(): ArrayBuffer
        {
            // first we have to extract the length 
            var sizeOfByteArray = this.ExtractNextPropertyAsNumber32Bit();

            // then we have to extract the complete following bytes as array
            var result = this.m_RawPayloadBuffer.slice(this.m_PayloadPositionPointer, this.m_PayloadPositionPointer + sizeOfByteArray.Number);
            this.m_PayloadPositionPointer += sizeOfByteArray.Number;

            return result;
        }

        /// <summary>
        /// Extracts the next property as string. 
        /// The raw bytes will be interpretated as an Unicode UTF16 encoded-string.
        /// The corresponding type in c++ is the std::wstring
        /// </summary>
        /// <returns></returns> 
        public ExtractNextPropertyAsString(): string
        {
            var stringBytes = this.ExtractNextPropertyAsArrayBuffer();
            return String.fromCharCode.apply(null, new Uint16Array(stringBytes));
        }

        /// <summary>
        /// Extracts the next property as String8Bit. 
        /// The raw bytes will be interpretated as an UTF8 encoded-string.
        /// The corresponding type in c++ is the std::string
        /// </summary>
        /// <returns></returns> 
        public ExtractNextPropertyAsString8Bit(): String8Bit
        {
            var stringBytes = this.ExtractNextPropertyAsArrayBuffer();
            return String.fromCharCode.apply(null, new Uint8Array(stringBytes));
        }

        /// <summary>
        /// Extracts the next property as byte.
        /// </summary>
        /// <returns></returns> 
        public ExtractNextPropertyAsNumber8Bit(): Number8Bit
        {
            const TYPE_SIZE = 1;

            var numberValue = new DataView(this.m_RawPayloadBuffer, this.m_PayloadPositionPointer, TYPE_SIZE).getInt8(0);
            this.m_PayloadPositionPointer += TYPE_SIZE;
            return new Number8Bit(numberValue);
        }

        /// <summary>
        /// Extracts the next property as UInt16.
        /// </summary>
        /// <returns></returns> 
        public ExtractNextPropertyAsUNumber16Bit(): UNumber16Bit
        {
            const TYPE_SIZE = 2;

            var numberValue = new DataView(this.m_RawPayloadBuffer, this.m_PayloadPositionPointer, TYPE_SIZE).getUint16(0, this.IS_LITTLE_ENDIAN);
            this.m_PayloadPositionPointer += TYPE_SIZE;
            return new UNumber16Bit(numberValue);
        }


        /// <summary>
        /// Extracts the next property as UInt32.
        /// </summary>
        /// <returns></returns> 
        public ExtractNextPropertyAsUNumber32Bit(): UNumber32Bit
        {
            const TYPE_SIZE = 4;

            var numberValue = new DataView(this.m_RawPayloadBuffer, this.m_PayloadPositionPointer, TYPE_SIZE).getUint32(0, this.IS_LITTLE_ENDIAN);
            this.m_PayloadPositionPointer += TYPE_SIZE;
            return new UNumber32Bit(numberValue);
        }

        /// <summary>
        /// Extracts the next property as UInt64.
        /// </summary>
        /// <returns></returns> 
        public ExtractNextPropertyAsUNumber64Bit(): UNumber64Bit
        {
            throw new Error("Not implemented");
        }


        /// <summary>
        /// Extracts the next property as boolean.
        /// </summary>
        /// <returns></returns>
        public ExtractNextPropertyAsBoolean(): boolean
        {
            var numberValue = this.ExtractNextPropertyAsNumber8Bit();
            if (numberValue.Number == 1)
            {
                return true;
            }
            else if (numberValue.Number == 0)
            {
                return false;
            }
            else
            {
                throw new Error("Error in ExtractNextPropertyAsBoolean");
            }
        }

        /// <summary>
        /// Extracts the next property as <see cref="BoostAny"/>.
        /// </summary>
        /// <returns></returns> 
        public ExtractNextPropertyAsBoostAny(): BoostAny
        {
            var boostAny: BoostAny;
            var boostAnyType: EBoostAnyType;
            boostAnyType = this.ExtractNextPropertyAsNumber32Bit().Number;

            switch (boostAnyType) {
                case EBoostAnyType.INT32:
                    {
                        boostAny = new BoostAny(boostAnyType, this.ExtractNextPropertyAsNumber32Bit());
                        break;
                    };
                case EBoostAnyType.UINT32:
                    {
                        boostAny = new BoostAny(boostAnyType, this.ExtractNextPropertyAsUNumber32Bit());
                        break;
                    };
                case EBoostAnyType.INT16:
                    {
                        boostAny = new BoostAny(boostAnyType, this.ExtractNextPropertyAsNumber16Bit());
                        break;
                    };
                case EBoostAnyType.UINT16:
                    {
                        boostAny = new BoostAny(boostAnyType, this.ExtractNextPropertyAsUNumber16Bit());
                        break;
                    };
                case EBoostAnyType.INT64:
                    {
                        boostAny = new BoostAny(boostAnyType, this.ExtractNextPropertyAsNumber64Bit());
                        break;
                    };
                case EBoostAnyType.UINT64:
                    {
                        boostAny = new BoostAny(boostAnyType, this.ExtractNextPropertyAsUNumber64Bit());
                        break;
                    };
                case EBoostAnyType.BOOLEAN:
                    {
                        boostAny = new BoostAny(boostAnyType, this.ExtractNextPropertyAsBoolean());
                        break;
                    };
                case EBoostAnyType.STRING:
                    {
                        boostAny = new BoostAny(boostAnyType, this.ExtractNextPropertyAsString());
                        break;
                    };
                case EBoostAnyType.BITMAP_RAWFORMAT:
                    {
                        throw new Error("Bitmap raw format is not implemented in Boost Any");
                    };
                case EBoostAnyType.UNDEFINED:
                    {
                        boostAny = new BoostAny();
                        break;
                    }
                default:
                    {
                        throw new Error("PayloadDecomposer:ExtractNextPropertyAsBoostAny>>BoostType is not yet implemented: " + boostAnyType);
                    };
            }

            return boostAny;
        }

        /// <summary>
        /// Extracts the next property as array of UInt64s.
        /// </summary>
        /// <returns></returns>
        public ExtractNextPropertyAsArrayOfNumber64Bit(): Number64Bit[] {
            var counter = this.ExtractNextPropertyAsNumber32Bit().Number;
            var result: Number64Bit[];

            for (var i = 0; i < counter; i++) {
                result.push(this.ExtractNextPropertyAsNumber64Bit());
            }
            return result;
        }

        /// <summary>
        /// Extracts the next property as array of UInt64s.
        /// </summary>
        /// <returns></returns>
        public ExtractNextPropertyAsArrayOfUNumber64Bit(): UNumber64Bit[]
        {
            var counter = this.ExtractNextPropertyAsNumber32Bit().Number;
            var result: UNumber64Bit[];

            for (var i = 0; i < counter; i++)
            {
                result.push(this.ExtractNextPropertyAsUNumber64Bit());
            }
            return result;
        }

        /// <summary>
        /// Extracts the next property as array of int16s.
        /// </summary>
        /// <returns></returns>
        public ExtractNextPropertyAsArrayOfNumber16Bit(): Number16Bit[] {
            var counter = this.ExtractNextPropertyAsNumber32Bit().Number;
            var result: Number16Bit[];

            for (var i = 0; i < counter; i++) {
                result.push(this.ExtractNextPropertyAsNumber16Bit());
            }
            return result;
        }

		/// <summary>
		/// Extracts the next property as array of Uint16s.
		/// </summary>
		/// <returns></returns>
        public ExtractNextPropertyAsArrayOfUNumber16Bit(): UNumber16Bit[] {
            var counter = this.ExtractNextPropertyAsNumber32Bit().Number;
            var result: UNumber16Bit[];

            for (var i = 0; i < counter; i++) {
                result.push(this.ExtractNextPropertyAsUNumber16Bit());
            }
            return result;
        }

        /// <summary>
        /// Extracts the next property as array of Int32s.
        /// </summary>
        /// <returns></returns>
        public ExtractNextPropertyAsArrayOfNumber32Bit(): Number32Bit[] {
            var counter = this.ExtractNextPropertyAsNumber32Bit().Number;
            var result: Number32Bit[];

            for (var i = 0; i < counter; i++) {
                result.push(this.ExtractNextPropertyAsNumber32Bit());
            }
            return result;
        }

		/// <summary>
        /// Extracts the next property as array of UInt32s.
        /// </summary>
        /// <returns></returns>
        public ExtractNextPropertyAsArrayOfUNumber32Bit(): UNumber32Bit[] {
            var counter = this.ExtractNextPropertyAsNumber32Bit().Number;
            var result: UNumber32Bit[];

            for (var i = 0; i < counter; i++) {
                result.push(this.ExtractNextPropertyAsUNumber32Bit());
            }
            return result;
        }

        /// <summary>
        /// Extracts the next property as FPDateTime.
        /// </summary>
        /// <returns></returns>
        public ExtractNextPropertyAsFPDateTime(): FPDateTime
        {
            var date = this.ExtractNextPropertyAsFPDate();
            var time = this.ExtractNextPropertyAsFPTime();

            var dateTime = new FPDateTime();
            dateTime.Date = date;
            dateTime.Time = time;
            return dateTime;
        }

        /// <summary>
        /// Extracts the next property as FPDate.
        /// </summary>
        /// <returns></returns>
        public ExtractNextPropertyAsFPDate() : FPDate
        {
            var date = new FPDate();

            date.Year = this.ExtractNextPropertyAsUNumber16Bit();
            date.Month = this.ExtractNextPropertyAsUNumber16Bit();
            date.Day = this.ExtractNextPropertyAsUNumber16Bit();

            return date;
        }

		/// <summary>
		/// Extracts the next property as FPTime.
		/// </summary>
        /// <returns></returns>
        public ExtractNextPropertyAsFPTime(): FPTime
        {
            var time = new FPTime();

            time.Hour = this.ExtractNextPropertyAsUNumber16Bit();
            time.Minute = this.ExtractNextPropertyAsUNumber16Bit();
            time.Second = this.ExtractNextPropertyAsUNumber16Bit();

            return time;
        }

		/// <summary>
		/// Extracts the next property as <see cref="ErrorInfo">ErrorInfo</see>.
		/// </summary>
        /// <returns></returns>
        public ExtractNextPropertyAsErrorInfo(): ErrorInfo
        {
            // Hint: All properties will be appended in the order of the model
            var error = new ErrorInfo();
            error.Code = this.ExtractNextPropertyAsUNumber32Bit();
            error.SubCode1 = this.ExtractNextPropertyAsUNumber32Bit();
            error.SubCode2 = this.ExtractNextPropertyAsUNumber32Bit();

            return error;
        }

		/// <summary>
		/// Extracts the next property as <see cref="ErrorInfo">ErrorInfo</see>.
		/// </summary>
        /// <returns></returns>
        public ExtractNextPropertyAsErrorText(): ErrorText
        {
            // Hint: All properties will be appended in the order of the model
            var errorText = new ErrorText();
            errorText.Text = this.ExtractNextPropertyAsString();
            errorText.Group = this.ExtractNextPropertyAsString();
            return errorText;
        }

		/// <summary>
		/// Extracts the next property as <see cref="EErrorType">ErrorInfo</see>.
		/// </summary>
        /// <returns></returns>
        public ExtractNextPropertyAsEErrorType(): EErrorType
        {
            var result: EErrorType;
            result = this.ExtractNextPropertyAsUNumber16Bit().Number;
            return result;
        }
        //#endregion

    }
}