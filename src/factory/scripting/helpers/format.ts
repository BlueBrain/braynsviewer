import { isObject, isVector3, isVector4 } from "@/tool/type-check"

type CodeSection = string | CodeSection[]

/**
 * It comes in handy to be able to stringify complex values to use
 * in Brayns entry-points.
 *
 * JSON can not be used in Python verbatim. `null` have to be replaced
 * with `None`, `true` with `True`, etc.
 */
export function formatValueAsPythonObject(
    value: unknown,
    prefix = "",
    suffix = ""
): CodeSection {
    if (value === true) return `${prefix}True${suffix}`
    if (value === false) return `${prefix}False${suffix}`
    if (value === null) return `${prefix}None${suffix}`
    if (isVector3(value) || isVector4(value)) {
        return `${prefix}${JSON.stringify(value)}${suffix}`
    }
    if (Array.isArray(value)) {
        if (value.length === 0) return `${prefix}[]${suffix}`
        if (value.length === 1) {
            return formatValueAsPythonObject(
                value[0],
                `${prefix}[`,
                `]${suffix}`
            )
        }
        const lines = value.map((item, index) =>
            formatValueAsPythonObject(item, "", ifNotLast(",", value, index))
        )
        return [`${prefix}[`, flattenOneLevel(lines), `]${suffix}`]
    }
    if (isObject(value)) {
        const keys = Array.from(Object.keys(value))
        const lines = keys.map((key, index) =>
            formatValueAsPythonObject(
                value[key],
                `"${key}": `,
                ifNotLast(",", keys, index)
            )
        )
        return [`${prefix}{`, flattenOneLevel(lines), `}${suffix}`]
    }
    return `${prefix}${JSON.stringify(value)}${suffix}`
}

function ifNotLast(text: string, arr: unknown[], index: number) {
    return arr.length - 1 !== index ? text : ""
}

function flattenOneLevel<T>(input: T | T[]): T[] {
    const arr: T[] = Array.isArray(input) ? input : [input]
    const flatArray: T[] = []
    for (const item of arr) {
        if (Array.isArray(item)) flatArray.push(...item)
        else flatArray.push(item)
    }
    return flatArray
}
