import { PythonScripting } from "@/contract/factory/scripting"

type CodePortion = string | Array<PythonScripting | string>

/**
 * Sometime you want to insert a piece of code inline, but you don't know if it will
 * stay on the same line or create a nested bloc. This function deals with such a problem.
 *
 * As an example, let's assume you need to write the Python code of a function call with
 * only one argument. You want to get something like this:
 *
 * ```python
 * exec(True)
 *
 * exec({
 *   "visible": False
 * })
 * ```
 *
 * if `arg` is the code of the value, then you can use this function like this:
 *
 * ```ts
 * stringify(
 *   ...surround("exec(", arg, ")")
 * )
 * ```
 * @param prefix
 * @param code
 * @param suffix
 * @returns
 */
export function surround(
    prefix: string,
    code: CodePortion,
    suffix: string
): CodePortion {
    if (typeof code === "string") return [`${prefix}${code}${suffix}`]

    if (code.length === 0) return [`${prefix}${suffix}`]

    if (typeof code[0] === "string") {
        code[0] = `${prefix}${code[0]}`
    } else {
        code.unshift(prefix)
    }
    const last = code.length - 1
    if (typeof code[last] === "string") {
        code[last] = `${codeToString(code[last])}${suffix}`
    } else {
        code.push(prefix)
    }
    return code
}

function codeToString(code: PythonScripting | CodePortion): string {
    if (typeof code === "string") return code

    if (Array.isArray(code)) return code.map(codeToString).join("\n")

    return codeToString(code.code)
}
