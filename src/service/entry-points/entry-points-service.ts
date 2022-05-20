import {
    assertBoolean,
    assertObject,
    assertObjectOrUndefined,
    assertString,
    isArray,
} from "@/tool/type-check"
import JSON5 from "json5"
import BraynsServiceInterface from "../../contract/service/brayns"
import EntryPointsServiceInterface, {
    EntryPointSchema,
    TypeDef,
} from "../../contract/service/entry-points"
import { PropertyDef } from "../../contract/type/type-definition"

export default class EntryPointsService implements EntryPointsServiceInterface {
    /**
     * Schemas can be put in cache because it's a definition that cannot
     * change during Brayns execution.
     */
    private static schemas = new Map<string, EntryPointSchema>()

    constructor(private readonly brayns: BraynsServiceInterface) {}

    async exec(entryPointName: string, param?: unknown): Promise<unknown> {
        return await this.brayns.exec(entryPointName, param)
    }

    async getEntryPointSchema(
        entryPointName: string
    ): Promise<EntryPointSchema> {
        if (EntryPointsService.schemas.has(entryPointName)) {
            return EntryPointsService.schemas.get(
                entryPointName
            ) as EntryPointSchema
        }
        try {
            const data = await this.brayns.exec("schema", {
                endpoint: entryPointName,
            })
            try {
                assertSchemaMethod(data)
            } catch (ex) {
                console.error(data)
                throw ex
            }
            try {
                const schema: EntryPointSchema = {
                    spawnAsyncTask: data.async,
                    description: data.description,
                    name: data.title,
                    params: sanitizeTypeDef(data.params),
                    result: sanitizeTypeDef(data.returns),
                }
                EntryPointsService.schemas.set(entryPointName, schema)
                return schema
            } catch (ex) {
                console.log("Unable to sanitize", data)
                throw Error(
                    `Error during sanitization of ${JSON5.stringify(
                        data
                    )}\n${ex}`
                )
            }
        } catch (ex) {
            console.error(
                `Unable to get schema for entry point "${entryPointName}":`,
                ex
            )
            throw Error(
                `Unable to get schema for entry point "${entryPointName}"\n${ex}`
            )
        }
    }

    async listAvailableEntryPoints(): Promise<string[]> {
        try {
            const data = await this.brayns.exec("registry")
            if (!isArray(data)) throw Error("We were expecting an array!")

            const entryPoints: string[] = data.filter(
                (item) => typeof item === "string"
            ) as string[]
            entryPoints.sort()
            return entryPoints
        } catch (ex) {
            console.error(
                "Unable to get the list of available entry points:",
                ex
            )
            throw ex
        }
    }
}

function assertSchemaMethod(data: any): asserts data is SchemaMethod {
    assertObject(data)
    const { async, description, title, params } = data
    assertBoolean(async, "data.async")
    assertString(description, "data.description")
    assertString(title, "data.title")
    assertObjectOrUndefined(params, "data.params")
}

type SchemaType = SchemaObject

interface SchemaMethod {
    title: string
    async: boolean
    plugin: string
    description: string
    params: any
    returns: any
}

interface SchemaObject {
    type: "object"
    title: string
    properties: {
        [key: string]: SchemaType
    }
}

/**
 * Brayns can give us types that are less strict than what we need.
 * This function will ensure all mandatory attributes are set and
 * that they stick to our definition of TypeDef.
 */
function sanitizeTypeDef(type: TypeDef | string | undefined): TypeDef {
    if (typeof type === "undefined") return { type: "undefined" }

    try {
        if (type === "string") return { type }
        if (type === "number") return { type }
        if (type === "boolean") return { type }
        if (type === "null") return { type }
        if (typeof type === "string") {
            throw Error(`Unknown type: "${type}"`)
        }

        if ("type" in type) {
            if (type.type === "array") {
                return {
                    ...type,
                    items: sanitizeTypeDef(type.items),
                }
            }
            if (type.type === "object") {
                return {
                    ...type,
                    required: isArray(type.required) ? type.required : [],
                    properties: sanitizeProperties(type.properties ?? {}),
                }
            }
        }
        if ("oneOf" in type) {
            return { oneOf: type.oneOf.map(sanitizeTypeDef) }
        }
        if ("anyOf" in type) {
            return { oneOf: type.anyOf.map(sanitizeTypeDef) }
        }
        return type
    } catch (ex) {
        console.error("Unable to sanitize type:", type)
        throw Error(`Unable to sanitize type ${JSON5.stringify(type)}\n${ex}`)
    }
}

function sanitizeProperties(properties: { [key: string]: PropertyDef }): {
    [key: string]: PropertyDef
} {
    const sanitizedProperties: { [key: string]: PropertyDef } = {}
    for (const name of Object.keys(properties)) {
        try {
            const property = properties[name]
            sanitizedProperties[name] = {
                ...sanitizeTypeDef(property),
                description: property.description,
            }
        } catch (ex) {
            console.error(`Unable to sanitize property "${name}"!`, ex)
            throw Error(`Unable to sanitize property "${name}"\n${ex}`)
        }
    }
    return sanitizedProperties
}
