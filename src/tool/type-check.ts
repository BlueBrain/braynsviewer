export function isObject(data: unknown): data is { [key: string]: unknown } {
    if (!data) return false
    if (Array.isArray(data)) return false
    return typeof data === "object"
}

export function isNull(data: unknown): data is null {
    return data === null
}

export function isNotNull(data: unknown): boolean {
    return data !== null
}

export function assertObject(
    data: unknown,
    name = "data"
): asserts data is { [key: string]: unknown } {
    if (Array.isArray(data)) {
        console.error(name, data)
        throw Error(`${name} was expected to be an object but we got an array!`)
    }
    if (!isObject(data)) {
        console.error(name, data)
        throw Error(
            `${name} was expected to be an object but we got ${typeof data}!`
        )
    }
}

export function isString(data: unknown): data is string {
    return typeof data === "string"
}

export function assertString(
    data: unknown,
    name = "data"
): asserts data is string {
    if (!isString(data)) {
        console.error(name, data)
        throw Error(
            `${name} was expected to be a string but we got ${typeof data}!`
        )
    }
}

/**
 * Return `data` only if it is a string, otherwise throw an exception.
 */
export function ensureFunction(data: unknown): () => void {
    assertFunction(data)
    return data
}

/**
 * Return `data` only if it is a string, otherwise throw an exception.
 */
export function ensureString(data: unknown): string {
    assertString(data)
    return data
}

export function isStringOrIUndefined(
    data: unknown
): data is string | undefined {
    return typeof data === "string" || typeof data === "undefined"
}

export function assertStringOrIUndefined(
    data: unknown,
    name = "data"
): asserts data is string | undefined {
    if (!isStringOrIUndefined(data)) {
        console.error(name, data)
        throw Error(
            `${name} was expected to ba a string or undefined but we got ${typeof data}!`
        )
    }
}

export function isNumber(data: unknown): data is number {
    return typeof data === "number"
}

export function assertNumber(
    data: unknown,
    name = "data"
): asserts data is number {
    if (!isNumber(data)) {
        console.error(name, data)
        throw Error(
            `${name} was expected to be a number but we got ${typeof data}!`
        )
    }
}

/**
 * Return `data` only if it is a number, otherwise throw an exception.
 */
export function ensureNumber(data: unknown, name = "data"): number {
    assertNumber(data, name)
    return data
}

/**
 * Return `data` only if it is a boolean, otherwise throw an exception.
 */
export function ensureBoolean(data: unknown, name = "data"): boolean {
    assertBoolean(data, name)
    return data
}

export function ensureUndefined(data: unknown, name = "data"): undefined {
    assertUndefined(data, name)
    return data
}

/**
 * Return `data` only if it is a setter function, otherwise throw an exception.
 */
export function ensureSetter<ValueType>(
    data: unknown,
    name = "data"
): (value: ValueType) => void {
    assertFunction(data, name)
    return data
}

export function isBoolean(data: unknown): data is boolean {
    return typeof data === "boolean"
}

export function isBooleanOrUndefined(
    data: unknown
): data is boolean | undefined {
    return typeof data === "boolean" || typeof data === "undefined"
}

export function isUndefined(data: unknown): data is undefined {
    return typeof data === "undefined"
}

export function assertBoolean(
    data: unknown,
    name = "data"
): asserts data is boolean {
    if (!isBoolean(data)) {
        console.error(name, data)
        throw Error(
            `${name} was expected to be a boolean but we got ${typeof data}!`
        )
    }
}

export function assertUndefined(
    data: unknown,
    name = "data"
): asserts data is undefined {
    if (!isUndefined(data)) {
        console.error(name, data)
        throw Error(
            `${name} was expected to be undefined but we got ${typeof data}!`
        )
    }
}

export function assertFunction(
    data: unknown,
    name = "data"
): asserts data is () => void {
    if (typeof data !== "function") {
        console.error(name, data)
        throw Error(
            `${name} was expected to be a function but we got ${typeof data}!`
        )
    }
}

export function isArrayBuffer(data: unknown): data is ArrayBuffer {
    if (!data) return false
    return data instanceof ArrayBuffer
}

export function isStringArray(data: unknown): data is string[] {
    if (!Array.isArray(data)) return false
    for (const item of data) {
        if (!isString(item)) return false
    }
    return true
}

export function assertStringArray(
    data: unknown,
    name = "data"
): asserts data is string[] {
    if (!isStringArray(data)) {
        console.error(name, data)
        throw Error(
            `${name} was expected to be an array of strings but we got ${typeof data}!`
        )
    }
}

export function isNumberArray(data: unknown): data is number[] {
    if (!Array.isArray(data)) return false
    for (const item of data) {
        if (!isNumber(item)) return false
    }
    return true
}

export function assertNumberArray(
    data: unknown,
    name = "data"
): asserts data is number[] {
    if (!isNumberArray(data)) {
        console.error(name, data)
        throw Error(
            `${name} was expected to be an array of numbers but we got ${typeof data}!`
        )
    }
}

export function isArray(data: unknown): data is unknown[] {
    return Array.isArray(data)
}

export function assertArray(
    data: unknown,
    name = "data"
): asserts data is unknown[] {
    if (!isArray(data)) {
        console.error(name, data)
        throw Error(
            `${name} was expected to be an array but we got ${typeof data}!`
        )
    }
}

export function assertVector2Array(
    data: unknown,
    suffix = "data"
): asserts data is Array<[number, number]> {
    assertArray(data, suffix)
    for (let i = 0; i < data.length; i++) {
        const elem: unknown = data[i]
        assertVector2(elem, `${suffix}[${i}]`)
    }
}

export function assertVector3Array(
    data: unknown,
    suffix = "data"
): asserts data is Array<[number, number, number]> {
    assertArray(data, suffix)
    for (let i = 0; i < data.length; i++) {
        const elem: unknown = data[i]
        assertVector3(elem, `${suffix}[${i}]`)
    }
}

export function assertVector2(
    data: unknown,
    suffix = "data"
): asserts data is [number, number] {
    assertArray(data, suffix)
    const [x, y] = data as [unknown, unknown]
    assertNumber(x, `${suffix}[0]`)
    assertNumber(y, `${suffix}[1]`)
}

export function isVector3(data: unknown): data is [number, number, number] {
    if (!isArray(data)) return false
    if (data.length !== 3) return false
    const [x, y, z] = data as [unknown, unknown, unknown]
    return isNumber(x) && isNumber(y) && isNumber(z)
}

export function assertVector3(
    data: unknown,
    suffix = "data"
): asserts data is [number, number, number] {
    assertArray(data, suffix)
    const [x, y, z] = data as [unknown, unknown, unknown]
    assertNumber(x, `${suffix}[0]`)
    assertNumber(y, `${suffix}[1]`)
    assertNumber(z, `${suffix}[2]`)
}

export function isVector4(
    data: unknown
): data is [number, number, number, number] {
    if (!isArray(data)) return false
    if (data.length !== 4) return false
    const [x, y, z, w] = data as [unknown, unknown, unknown, unknown]
    return isNumber(x) && isNumber(y) && isNumber(z) && isNumber(w)
}

export function isVector4OrUndefined(
    data: unknown
): data is [number, number, number, number] | undefined {
    return isVector4(data) || isUndefined(data)
}

export function assertVector4(
    data: unknown,
    suffix = "data"
): asserts data is [number, number, number, number] {
    assertArray(data, suffix)
    const [x, y, z, w] = data as [unknown, unknown, unknown, unknown]
    assertNumber(x, `${suffix}[0]`)
    assertNumber(y, `${suffix}[1]`)
    assertNumber(z, `${suffix}[2]`)
    assertNumber(w, `${suffix}[3]`)
}

export function assertOptionalArrayBuffer(
    data: unknown,
    suffix = "data"
): asserts data is ArrayBuffer | undefined {
    if (typeof data === "undefined") return
    assertArrayBuffer(data, suffix)
}

export function assertArrayBuffer(
    data: unknown,
    suffix = "data"
): asserts data is ArrayBuffer | undefined {
    if (data instanceof ArrayBuffer) return
    console.error(suffix, data)
    throw Error(`${suffix} was expected to ba an ArrayBuffer!`)
}

export function isError(data: unknown): data is Error {
    return data instanceof Error
}

export type TypeDef =
    | "boolean"
    | "null"
    | "undefined"
    | "string"
    | "number"
    | "function"
    | "unknown"
    | ["string", { min?: number; max?: number }]
    | ["number", { min?: number; max?: number }]
    | ["|", ...TypeDef[]]
    | ["?", TypeDef]
    | ["array", TypeDef]
    | [`array(${number})`, TypeDef]
    | ["map", TypeDef]
    | { [name: string]: TypeDef }

export function isType<T>(data: unknown, type: TypeDef): data is T {
    try {
        assertType(data, type)
        return true
    } catch (ex) {
        console.warn(ex)
        return false
    }
}

export function assertType<T>(
    data: unknown,
    type: TypeDef,
    prefix = "data"
): asserts data is T {
    if (type === "unknown") return

    if (type === "null") {
        if (data !== null) {
            throw Error(
                `Expected ${prefix} to be null and not a ${typeof data}!`
            )
        }
        return
    }

    if (typeof type === "string") {
        if (typeof data !== type) {
            throw Error(
                `Expected ${prefix} to be a string and not a ${typeof data}!`
            )
        }
        return
    }
    if (Array.isArray(type)) {
        const [kind] = type
        switch (kind) {
            case "array":
                assertTypeArray(data, prefix, type)
                return
            case "map":
                assertTypeMap(data, prefix, type)
                return
            case "?":
                assertTypeOptional(data, prefix, type)
                return
            case "|":
                assertTypeAlternative(data, prefix, type)
                return
            default:
                if (kind.startsWith("array(")) {
                    const size = parseInt(
                        kind.substring("array(".length, kind.length - 1),
                        10
                    )
                    assertTypeArrayWithDimension(
                        data,
                        prefix,
                        type as [unknown, TypeDef],
                        size
                    )
                    return
                }
                throw Error(
                    `Don't know how to create a type guard for this kind of type: ${JSON.stringify(
                        type
                    )}`
                )
        }
    }

    if (typeof data !== "object")
        throw Error(
            `Expected ${prefix} to be an object and not a ${typeof data}!`
        )

    const obj = data as { [key: string]: unknown }
    for (const name of Object.keys(type)) {
        if (typeof name !== "string") continue

        const objType = type[name]
        if (objType) assertType(obj[name], type[name], `${prefix}.${name}`)
    }
}

function assertTypeArrayWithDimension(
    data: unknown,
    prefix: string,
    type: [unknown, TypeDef],
    size: number
) {
    if (!Array.isArray(data))
        throw Error(
            `Expected ${prefix} to be an array and not a ${typeof data}!`
        )
    if (data.length !== size)
        throw Error(
            `${prefix} was expected to have a length of ${size}, but we got ${data.length}!`
        )
    const [, subType] = type
    for (let i = 0; i < data.length; i += 1) {
        assertType(data[i], subType, `${prefix}[${i}]`)
    }
}

function assertTypeArray(
    data: unknown,
    prefix: string,
    type: ["array", TypeDef]
) {
    if (!Array.isArray(data))
        throw Error(
            `Expected ${prefix} to be an array and not a ${typeof data}!`
        )
    const [, subType] = type
    for (let i = 0; i < data.length; i += 1) {
        assertType(data[i], subType, `${prefix}[${i}]`)
    }
}

function assertTypeMap(data: unknown, prefix: string, type: ["map", TypeDef]) {
    if (!isObject(data))
        throw Error(
            `Expected ${prefix} to be an object and not a ${typeof data}!`
        )
    const [, subType] = type
    for (const key of Object.keys(data)) {
        if (typeof key === "string") {
            assertType(data[key], subType, `${prefix}[${key}]`)
        }
    }
}

function assertTypeOptional(
    data: unknown,
    prefix: string,
    type: ["?", TypeDef]
) {
    if (typeof data === "undefined") return

    const [, optionalType] = type
    assertType(data, optionalType, prefix)
}

function assertTypeAlternative(
    data: unknown,
    prefix: string,
    type: ["|", ...TypeDef[]]
) {
    const [, ...altTypes] = type
    let lastException = Error(
        `No type has been defined for this alternative: ${JSON.stringify(
            type
        )}!`
    )
    for (const altType of altTypes) {
        try {
            assertType(data, altType, prefix)
            return
        } catch (ex) {
            if (ex instanceof Error) lastException = ex
        }
    }
    throw lastException
}
