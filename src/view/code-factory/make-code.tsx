import React from "react"

import { EntryPointSchema, TypeDef } from "@/contract/service/entry-points"
import { EntryPointsHierarchy } from "@/hooks/entry-points"
import {
    isBasicTypeDef,
    isTypeArrayDef,
    isTypeIntegerDef,
    isTypeObjectDef,
} from "@/contract/type/type-definition"

export function makeCode(
    entryPoints: EntryPointsHierarchy,
    prefix: string
): React.SetStateAction<string> {
    return toCode([
        `export class ${prefix}Api {`,
        Object.keys(entryPoints).map((name) =>
            makeEntryPointMethod(name, entryPoints[name])
        ),
        "}",
    ])
}

type Code = string | Code[]

function toCode(code: Code, indent = ""): string {
    if (typeof code === "string") return `${indent}${code}`

    const nextIndent = `${indent}  `
    return code.map((item) => toCode(item, nextIndent)).join("\n")
}

function makeEntryPointMethod(name: string, schema: EntryPointSchema): Code {
    return [
        "/**",
        ` * Entrypoint **"${name}"**`,
        ...schema.description.split("\n").map((line) => ` * ${line}`),
        " */",
        surround(
            typeToCode(schema.params),
            `public async ${pascalCase(name)}(params: `,
            "):"
        ),
        surround(typeToCode(schema.result), "Promise<", "> {"),
        [`return this.#exec(${JSON.stringify(name)}, params)`],
        "}",
        "",
    ]
}

function pascalCase(name: string): string {
    return name
        .split("-")
        .map((part, index) =>
            index === 0
                ? part
                : `${part.charAt(0).toUpperCase()}${part.substring(1)}`
        )
        .join("")
}

function typeToCode(data: TypeDef): Code {
    if (isBasicTypeDef(data)) return data.type

    if (isTypeIntegerDef(data)) return "number"

    if (isTypeArrayDef(data)) {
        return surround(typeToCode(data.items), "Array<", ">")
    }

    if (isTypeObjectDef(data)) {
        return [
            "{",
            Object.keys(data.properties).map((name) =>
                surround(typeToCode(data.properties[name]), `${name}: `, "")
            ),
            "}",
        ]
    }
    return JSON.stringify(data)
}

function surround(code: Code, before: string, after: string): Code {
    if (typeof code === "string") return `${before}${code}${after}`
    if (code.length === 1) {
        const [unique] = code
        return [surround(unique, before, after)]
    }
    code[0] = surround(code[0], before, "")
    const last = code.length - 1
    code[last] = surround(code[last], "", after)
    return code
}
