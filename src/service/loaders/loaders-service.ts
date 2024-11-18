import BraynsServiceInterface from "@/contract/service/brayns"
import LoadersServiceInterface, {
    AddModelParams,
    LoaderDefinition,
    LoaderPropertyDefinition,
} from "@/contract/service/loaders"
import {
    assertArray,
    assertObject,
    assertString,
    assertStringArray,
    assertType,
} from "@/tool/type-check"

export default class LoadersService implements LoadersServiceInterface {
    /**
     * Loaders can be put in cache because it's a definition that cannot
     * change during Brayns execution.
     */
    private static loaders?: LoaderDefinition[]

    constructor(private readonly brayns: BraynsServiceInterface) {}

    async addModel(params: AddModelParams): Promise<unknown> {
        return await this.brayns.exec("add-model", params)
    }

    async listAvailableLoaders(): Promise<LoaderDefinition[]> {
        if (!LoadersService.loaders) {
            LoadersService.loaders = []
            await this.getLoadersExtensionsAndDefaultValues(
                LoadersService.loaders
            )
            // Sort by names in ascending order without taking care of case.
            LoadersService.loaders.sort((a, b) => {
                const nameA = a.name.trim().toLowerCase()
                const nameB = b.name.trim().toLowerCase()
                if (nameA < nameB) return -1
                if (nameA > nameB) return +1
                return 0
            })
        }
        return LoadersService.loaders
    }

    /**
     * By calling "get-loaders" entrypoint, we get the list of available
     * loaders with the name, the expected extensions and the properties
     * with their default values.
     */
    private async getLoadersExtensionsAndDefaultValues(
        loaders: LoaderDefinition[]
    ) {
        const loadersExtensionsDefArray = await this.brayns.exec("get-loaders")
        if (!isLoadersExtensionDefArray(loadersExtensionsDefArray)) {
            console.error(
                `"get-loaders" returned a data of unexpected type!`,
                loadersExtensionsDefArray
            )
            throw Error(`Bad return from "get-loaders"!`)
        }
        for (const def of loadersExtensionsDefArray) {
            loaders.push({
                name: def.name,
                extensions: def.extensions,
                properties: parseInputParameters(def.inputParametersSchema),
            })
        }
    }
}

/**
 * Entrypoint "get-loaders" should return an array of `LoadersExtensionDef`.
 */
interface LoadersExtensionDef {
    name: string
    extensions: string[]
    inputParametersSchema: InputParametersSchema
}

interface InputParametersSchema {
    additionalProperties?: boolean
    properties?: { [key: string]: LoadersSchemaProperty }
    required?: string[]
    title?: string
    type?: string
}

function isLoadersExtensionDefArray(
    data: unknown
): data is LoadersExtensionDef[] {
    try {
        assertArray(data)
        for (let i = 0; i < data.length; i++) {
            const item = data[i]
            assertLoadersExtensionDef(item, `data[${i}]`)
        }
        return true
    } catch (ex) {
        console.error(ex)
        return false
    }
}

function assertLoadersExtensionDef(
    data: unknown,
    prefix: string
): asserts data is LoadersExtensionDef {
    assertObject(data, prefix)
    const { name, extensions, inputParametersSchema } = data
    assertString(name, `${prefix}.name`)
    assertStringArray(extensions, `${prefix}.extensions`)
    assertInputParametersSchema(
        inputParametersSchema,
        `${prefix}.inputParametersSchema`
    )
}

function assertInputParametersSchema(
    data: unknown,
    prefix: string
): asserts data is InputParametersSchema {
    assertType(
        data,
        {
            additionalProperties: ["?", "boolean"],
            properties: ["?", ["map", "unknown"]],
            required: ["?", ["array", "string"]],
            title: ["?", "string"],
            type: ["?", "string"],
        },
        prefix
    )
}

interface LoadersSchemaProperty {
    title?: string
    type?: string
    default?: string | number | boolean
    description?: string
    enum?: unknown[]
    minItems?: number
    maxItems?: number
    items?: { type: string }
}

function parseInputParameters(
    inputParametersSchema: InputParametersSchema
): LoaderPropertyDefinition[] {
    const loaderPropsDef: LoaderPropertyDefinition[] = []
    const { properties } = inputParametersSchema
    if (properties) {
        for (const name of Object.keys(properties)) {
            const prop = properties[name]
            loaderPropsDef.push(
                convertType(prop, {
                    name,
                    title: prop.title ?? name,
                    defaultValue: prop.default,
                    description: prop.description,
                    minItems: prop.minItems,
                    maxItems: prop.maxItems,
                })
            )
        }
    }
    return loaderPropsDef
}

function convertType(
    propSchema: LoadersSchemaProperty,
    propDef: LoaderPropertyDefinition
): LoaderPropertyDefinition {
    switch (propSchema.type) {
        case "string":
        case "number":
        case "boolean":
        case "integer":
            propDef.type = propSchema.type
            return propDef
        case "array":
            return convertArrayType(propSchema, propDef)
        default:
            return propDef
    }
}

function convertArrayType(
    propSchema: LoadersSchemaProperty,
    propDef: LoaderPropertyDefinition
): LoaderPropertyDefinition {
    const { minItems, maxItems } = propSchema
    propSchema.minItems = minItems
    propSchema.maxItems = maxItems
    const subType = propSchema.items?.type
    if (subType === "number") {
        if (minItems === 3 && maxItems === 3) {
            propDef.type = "vector3"
            return propDef
        }
        if (minItems === 4 && maxItems === 4) {
            propDef.type = "vector4"
            return propDef
        }
    }
    switch (subType) {
        case "integer":
        case "number":
        case "string":
            propDef.type = `${subType}[]`
            return propDef
        default:
            console.warn(`Don't know how to deal with Array of "${subType}"!`)
            return propDef
    }
}
