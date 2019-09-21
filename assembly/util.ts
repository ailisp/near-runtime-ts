export namespace util {

  export function stringToBytes(s: string): Uint8Array {
    let len = String.UTF8.byteLength(s, true) - 1;
    let bytes = new Uint8Array(len);
    memory.copy(bytes.dataStart, toUTF8(s), len);
    return bytes;
  }

  export function bytesToString(bytes: Uint8Array): string | null {
    if (bytes == null) {
      return null;
    }
    return String.UTF8.decode(uint8ArrayToBuffer(bytes), true)
  }

  export function UTF8Length(str: string, nullTerminated: boolean = false): usize {
    return String.UTF8.byteLength(str, nullTerminated);
  }

  export function toUTF8(str: string, nullTerminated: boolean = false): usize {
    return changetype<usize>(String.UTF8.encode(str, nullTerminated));
  }

  function uint8ArrayToBuffer(array: Uint8Array): ArrayBuffer {
    return array.buffer.slice(array.byteOffset, array.byteLength + array.byteOffset)
  }

  /**
  * Parses the given bytes array to return a value of the given generic type.
  * Supported types: bool, integer, string and data objects defined in model.ts.
  *
  * @param bytes Bytes to parse. Bytes must be not null.
  * @returns A parsed value of type T.
  */
  export function parseFromBytes<T>(bytes: Uint8Array): T {
    if (isString<T>() || isInteger<T>()) {
      //@ts-ignore bytes is non-null so output will be nun-null
      return parseFromString<T>(bytesToString(bytes));
    } else {
      return decode<T>(bytes);
    }
  }

  /**
  * Parses the given string to return a value of the given generic type.
  * Supported types: bool, integer, string and data objects defined in model.ts.
  *
  * @param s String to parse. Must be not null.
  * @returns A parsed value of type T.
  */
  export function parseFromString<T>(s: string): T {
    if (isString<T>()) {
      //@ts-ignore
      return s;
    } else if (isInteger<T>()) {
      if (isBoolean<T>()) {
        //@ts-ignore
        return <T>(s == "true");
      } else if (isSigned<T>()) {
        //@ts-ignore
        return <T>I64.parseInt(s);
      } else {
        //@ts-ignore
        return <T>U64.parseInt(s);
      }
    } else {
      return decode<T>(stringToBytes(s));
    }
  }
}