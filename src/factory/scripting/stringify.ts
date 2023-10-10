import { isObject } from "@/tool/type-check"
import { PythonScripting, ScriptingImport } from "@/contract/factory/scripting"

type CodeBloc = string | CodeBloc[]

export function stringify(script: PythonScripting, indent = "    "): string {
    const code = flattenCode(keepOnlyCode(script))
    console.log("🚀 [stringify] code = ", code) // @FIXME: Remove this line written on 2022-03-01 at 15:54
    return `${stringifyImports(script)}    
${stringifyCode(code, indent, -1)}`
}

export function stringifyCode(
    code: CodeBloc,
    indent: string,
    level = 0
): string {
    const prefix = repeat(indent, level)
    if (typeof code === "string") return `${prefix}${code}`
    return code.map((line) => stringifyCode(line, indent, level + 1)).join(`\n`)
}

export function stringifyImports(code: PythonScripting) {
    const directImports = new Set<string>()
    const fromImports = new Map<string, Set<string>>()
    const walk = (section: PythonScripting) => {
        let imports: ScriptingImport[] = []
        let code: Array<string | PythonScripting> = []
        if (hasImports(section)) {
            imports = section.imports
            code = section.code
        } else {
            code = Array.isArray(section) ? section : [section]
        }
        for (const imp of imports) {
            if (typeof imp === "string") {
                directImports.add(imp)
            } else {
                const list = fromImports.get(imp.from) ?? new Set<string>()
                if (isSingleNameImport(imp)) {
                    list.add(imp.name)
                } else {
                    for (const name of imp.names) {
                        list.add(name)
                    }
                }
                fromImports.set(imp.from, list)
            }
        }
        for (const line of code) {
            if (typeof line === "string") continue
            walk(line)
        }
    }
    walk(code)
    return `${Array.from(directImports.keys())
        .sort()
        .map((name) => `import ${name}`)
        .join("\n")}
${Array.from(fromImports.keys())
    .sort()
    .map(
        (key) =>
            `from ${key} import ${Array.from(fromImports.get(key)?.keys() ?? [])
                .sort()
                .join(", ")}`
    )
    .join("\n")}`
}

/**
 * Remove everything that deals with other stuff than code.
 * For instance imports.
 */
function keepOnlyCode(code: PythonScripting | string): CodeBloc {
    if (typeof code === "string") return code
    if (Array.isArray(code)) return code.map(keepOnlyCode)
    const subCode = code.code
    if (Array.isArray(subCode)) return subCode.map(keepOnlyCode)
    return keepOnlyCode(subCode)
}

function hasImports(data: PythonScripting): data is {
    imports: ScriptingImport[]
    code: Array<string | PythonScripting>
} {
    return !Array.isArray(data)
}

function repeat(text: string, times: number): string {
    if (times < 1) return ""

    let result = ""
    for (let i = 0; i < times; i++) result += text
    return result
}

function isSingleNameImport(
    data: unknown
): data is { name: string; from: string } {
    if (!isObject(data)) return false
    if (typeof data.from !== "string") return false
    return typeof data.name === "string"
}

function containsOnlyArrays(arr: Array<unknown>) {
    for (const item of arr) {
        if (!Array.isArray(item)) return false
    }
    return true
}

/**
 * Will transform arrays such
 * `[["Hello", [["world"], ["of", "madness"]]], [["!"]]]`
 * into `[["Hello", ["world", "of", "madness"]], "!"]`.
 * @returns
 */
export function flattenCode(codeBloc: CodeBloc): CodeBloc {
    if (typeof codeBloc === "string") return codeBloc
    const newBloc = codeBloc.map(flattenCode)
    if (!containsOnlyArrays(newBloc)) return newBloc
    const flatCode: CodeBloc = []
    for (const item of newBloc) {
        flatCode.push(...item)
    }
    return flatCode
}
