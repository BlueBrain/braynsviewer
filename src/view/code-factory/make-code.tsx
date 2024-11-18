import React from "react"

import { EntryPointSchema, TypeDef } from "@/contract/service/entry-points"
import { EntryPointsHierarchy } from "@/hooks/entry-points"
import {
    isBasicTypeDef,
    isTypeArrayDef,
    isTypeIntegerDef,
    isTypeObjectDef,
    isTypeOneOfDef,
} from "@/contract/type/type-definition"

export function makeCode(
    entryPoints: EntryPointsHierarchy,
    prefix: string
): React.SetStateAction<string> {
    try {
        return toCode([
            "interface JsonRpcService {",
            ["exec(entryPointName: string, param?: unknown): Promise<unknown>"],
            "}",
            "",
            "interface ApiTask {",
            [
                "entrypoint: string",
                "params: unknown",
                "resolves: Array<(result: unknown) => void>",
                "rejects: Array<(ex: unknown) => void>",
            ],
            "}",
            "",
            `export class ${prefix}Api {`,
            [
                "readonly #service: JsonRpcService",
                "readonly #collapsables: string[]",
                "#tasks: ApiTask[] = []",
                "#processing = false",
                "",
                "constructor(",
                [
                    "options: {",
                    ["service: JsonRpcService,", "collapsables?: string[]"],
                    "}",
                ],
                ") {",
                [
                    "this.#service = options.service",
                    "this.#collapsables = options.collapsables ?? []",
                ],
                "}",
                "",
                "#exec(entrypoint: string, params: unknown): Promise<unknown> {",
                [
                    "return new Promise((resolve, reject) => {",
                    [
                        "const resolves = [resolve]",
                        "const rejects = [reject]",
                        "if (this.#collapsables.includes(entrypoint)) {",
                        [
                            "this.#tasks = this.#tasks.filter((task) => {",
                            [
                                "if (task.entrypoint !== entrypoint) return true",
                                "",
                                "resolves.push(...task.resolves)",
                                "rejects.push(...task.rejects)",
                                "return false",
                            ],
                            "})",
                        ],
                        "}",
                        "this.#tasks.push({",
                        ["entrypoint, params, resolves, rejects,"],
                        "})",
                        "void this.#process()",
                    ],
                    "})",
                ],
                "}",
                "",
                "async #process() {",
                [
                    "if (this.#processing) return",
                    "",
                    "this.#processing = true",
                    "try {",
                    [
                        "while (this.#tasks.length > 0) {",
                        [
                            "const task = this.#tasks.shift()",
                            [
                                "if (!task) return",
                                "",
                                "try {",
                                [
                                    "const result = await this.#service.exec(",
                                    ["task.entrypoint,", "task.params"],
                                    ")",
                                    "task.resolves.forEach((resolve) => resolve(result))",
                                ],
                                "} catch (ex) {",
                                [
                                    "task.rejects.forEach((reject) => reject(ex))",
                                ],
                                "}",
                            ],
                            "}",
                        ],
                        "} catch (ex) {",
                        ["console.error(ex)"],
                        "} finally {",
                        ["this.#processing = false"],
                        "}",
                    ],
                    "}",
                ],
            ],
            "",
            ...Object.keys(entryPoints).map((name) =>
                makeEntryPointMethod(name, entryPoints[name], prefix)
            ),
            "}",
            "",
            ...Object.keys(entryPoints).map((name) =>
                makeEntryPointInterfaces(name, entryPoints[name], prefix)
            ),
        ])
    } catch (ex) {
        if (ex instanceof Error) return ex.message
        return JSON.stringify(ex)
    }
}

type Code = string | Code[]

function toCode(code: Code, indent = ""): string {
    if (typeof code === "string") return `${indent}${code}`

    const nextIndent = `${indent}  `
    return code.map((item) => toCode(item, nextIndent)).join("\n")
}

function makeEntryPointInterfaces(
    name: string,
    schema: EntryPointSchema,
    prefix: string
): Code {
    const baseName = `${prefix}Api${capitalize(pascalCase(name))}`
    return join(
        surround(
            typeToCode(schema.params),
            `export type ${baseName}Params = `,
            "\n"
        ),
        surround(
            typeToCode(schema.result),
            `export type ${baseName}Result = `,
            "\n"
        )
    )
}

function makeEntryPointMethod(
    name: string,
    schema: EntryPointSchema,
    prefix: string
): Code {
    const baseName = `${prefix}Api${capitalize(pascalCase(name))}`
    return [
        "/**",
        ...schema.description.split("\n").map((line) => ` * ${line}`),
        " *",
        ` * Entrypoint **"${name}"**`,
        " */",
        `public async ${pascalCase(
            name
        )}(params: ${baseName}Params): Promise<${baseName}Result> {`,
        [
            `const result = await this.#exec(${JSON.stringify(name)}, params)`,
            `return result as ${baseName}Result`,
        ],
        "}",
        "",
    ]
}

function pascalCase(name: string): string {
    return name
        .split("-")
        .map((part, index) =>
            index === 0 ? part.toLowerCase() : capitalize(part)
        )
        .join("")
}

function capitalize(name: string): string {
    return `${name.charAt(0).toUpperCase()}${name.substring(1)}`
}

function typeToCode(data: TypeDef): Code {
    if (isBasicTypeDef(data)) return data.type

    if (isTypeIntegerDef(data)) return "number"

    if (isTypeArrayDef(data)) {
        return surround(typeToCode(data.items), "Array<", ">")
    }

    if (isTypeObjectDef(data)) {
        const keys = Object.keys(data.properties)
        if (keys.length === 0) return "object"

        return [
            `/**`,
            ` * **${data.required ? "REQUIRED" : "Optional"}**  `,
            ` * ${data.description}`,
            ` */`,
            "{",
            keys.map((name) =>
                surround(typeToCode(data.properties[name]), `${name}: `, "")
            ),
            "}",
        ]
    }

    if (isTypeOneOfDef(data)) {
        return data.oneOf.map((item, index) =>
            index === 0
                ? typeToCode(item)
                : surround(typeToCode(item), "| ", "")
        )
    }

    return [
        "",
        "/****************************************",
        [
            "WARNING!",
            "Don't know how to deal with this type:",
            ...JSON.stringify(data, null, "  ").split("\n"),
        ],
        "****************************************/",
        "unknown",
    ]
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

function join(...codes: Code[]): Code {
    const result: Code[] = []
    codes.forEach((code) => {
        if (typeof code === "string") {
            result.push(code)
        } else {
            result.push(...code)
        }
    })
    return result
}
