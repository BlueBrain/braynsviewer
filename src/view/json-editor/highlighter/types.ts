export interface ISection {
    start: number
    length: number
    className: string
}

export type IRule = [string, RegExp]

export interface IValidationResult {
    pos: number
    err?: string
}

export function isValidationResult(value: any): value is IValidationResult {
    if (typeof value !== "object") return false
    const { pos, err } = value as { pos: any; err: any }
    if (typeof pos !== "number") return false
    if (pos < 0) return true
    if (typeof err !== "string") return false
    return true
}
