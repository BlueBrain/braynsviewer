/**
 * `is*()` functions are useful to help Typescript to narrow the type of a var.
 * `try*()` functions will throw an exception is the type is not the expected one.
 * These functions can be helpful when writing a complex type checker `is*()`
 * and being able to report where in the structure the type was wrong.
 */

/**
 * Is `data` of type string?
 */
export function isString(data: any): data is string {
    return typeof data === "string"
}

export function tryString(data: any, name: string = "data") {
    if (!isString(data)) {
        throw Error(`Typeof ${name} must be String!`)
    }
}

/**
 * Is `data` of type number?
 */
export function isNumber(data: any): data is string {
    return typeof data === "number"
}

export function tryNumber(data: any, name: string = "data") {
    if (!isNumber(data)) {
        throw Error(`Typeof ${name} must be Number!`)
    }
}

/**
 * Is `data` of type array?
 */
export function isArray(data: any): data is any[] {
    return Array.isArray(data)
}

export function tryArray(data: any, name: string = "data") {
    if (!isArray(data)) {
        throw Error(`Typeof ${name} must be Array!`)
    }
}

/**
 * Is `data` an array with each element being a string.
 */
export function isStringArray(data: any): data is string[] {
    if (!isArray(data)) return false
    for (const value of data) {
        if (typeof value !== "string") return false
    }
    return true
}

export function tryStringArray(data: any, name: string = "data") {
    if (!isStringArray(data)) {
        throw Error(`Typeof ${name} must be StringArray!`)
    }
}

/**
 * Is `data` an array with each element being a number.
 */
export function isNumberArray(data: any): data is number[] {
    if (!isArray(data)) return false
    for (const value of data) {
        if (typeof value !== "number") return false
    }
    return true
}

export function tryNumberArray(data: any, name: string = "data") {
    if (!isNumberArray(data)) {
        throw Error(`Typeof ${name} must be NumberArray!`)
    }
}

/**
 * Check if `data` is a non-null, non-undefined object
 * with string attributes of any type.
 */
export function isObject(data: any): data is { [key: string]: any } {
    if (!data || isArray(data)) return false
    return typeof data === "object"
}

export function tryObject(data: any, name: string = "data") {
    if (!isObject(data)) {
        throw Error(`Typeof ${name} must be Object!`)
    }
}

/**
 * Is `data` of type [number, number, number]?
 */
export function isVector3(data: any): data is [number, number, number] {
    if (!isArray(data)) return false
    if (data.length !== 3) return false
    for (const item of data) {
        if (!isNumber(item)) return false
    }
    return true
}

export function tryVector3(data: any, name: string = "data") {
    if (!isVector3(data)) {
        throw Error(`Typeof ${name} must be Vector3!`)
    }
}

/**
 * Is `data` of type [number, number, number, number]?
 */
export function isVector4(data: any): data is [number, number, number, number] {
    if (!isArray(data)) return false
    if (data.length !== 4) return false
    for (const item of data) {
        if (!isNumber(item)) return false
    }
    return true
}

export function tryVector4(data: any, name: string = "data") {
    if (!isVector4(data)) {
        throw Error(`Typeof ${name} must be Vector4!`)
    }
}
