/**
 * `is*()` functions are useful to help Typescript to narrow the type of a var.
 * `assert*()` functions will throw an exception is the type is not the expected one.
 * These functions can be helpful when writing a complex type checker `is*()`
 * and being able to report where in the structure the type was wrong.
 */

export function isObject(data: unknown): data is { [key: string]: unknown } {
    if (Array.isArray(data)) return false
    return typeof data === "object"
}

export function assertObject(
    data: unknown,
    name = "data"
): asserts data is { [key: string]: unknown } {
    if (!isObject(data)) {
        console.error(`${name}:`, data)
        throw Error(
            `${name} was expected to be an object but we got ${typeof data}!`
        )
    }
}

export function assertObjectOrUndefined(
    data: unknown,
    name = "data"
): asserts data is { [key: string]: unknown } | undefined {
    if (typeof data !== "undefined" && !isObject(data)) {
        console.error(`${name}:`, data)
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
        throw Error(
            `${name} was expected to be a string but we got ${typeof data}!`
        )
    }
}

/**
 * Return `data` only if it is a string, otherwise return `defaultValue`.
 */
export function ensureString(data: unknown, defaultValue: string): string {
    return isString(data) ? data : defaultValue
}

export function isStringOrUndefined(data: unknown): data is string | undefined {
    return typeof data === "string" || typeof data === "undefined"
}

export function assertStringOrUndefined(
    data: unknown,
    name = "data"
): asserts data is string | undefined {
    if (!isStringOrUndefined(data)) {
        console.error(`${name}:`, data)
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
        throw Error(
            `${name} was expected to be a number but we got ${typeof data}!`
        )
    }
}

export function assertNumberOrUndefined(
    data: unknown,
    name = "data"
): asserts data is number | undefined {
    if (typeof data !== "undefined" && !isNumber(data)) {
        throw Error(
            `${name} was expected to be a number but we got ${typeof data}!`
        )
    }
}

/**
 * Return `data` only if it is a number, otherwise return `defaultValue`.
 */
export function ensureNumber(data: unknown, defaultValue: number): number {
    return isNumber(data) ? data : defaultValue
}

export function isBoolean(data: unknown): data is boolean {
    return typeof data === "boolean"
}

export function assertBoolean(
    data: unknown,
    name = "data"
): asserts data is boolean {
    if (!isBoolean(data)) {
        throw Error(
            `${name} was expected to be a boolean but we got ${typeof data}!`
        )
    }
}

export function assertBooleanOrUndefined(
    data: unknown,
    name = "data"
): asserts data is boolean | undefined {
    if (typeof data !== "undefined" && !isBoolean(data)) {
        throw Error(
            `${name} was expected to be a boolean but we got ${typeof data}!`
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
        throw Error(
            `${name} was expected to be an array of strings but we got ${typeof data}!`
        )
    }
}

export function assertStringArrayOrUndefined(
    data: unknown,
    name = "data"
): asserts data is string[] | undefined {
    if (typeof data !== "undefined" && !isStringArray(data)) {
        throw Error(
            `${name} was expected to be an array of strings but we got ${typeof data}!`
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
        throw Error(
            `${name} was expected to be an array but we got ${typeof data}!`
        )
    }
}

export function isNumberArray(data: unknown): data is number[] {
    if (!isArray(data)) return false
    for (const element of data) {
        if (!isNumber(element)) return false
    }
    return true
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
    const [x, y, z, w] = data as [unknown, unknown, unknown, unknown]
    return isNumber(x) && isNumber(y) && isNumber(z) && isNumber(w)
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
