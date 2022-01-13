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
    assertBooleanOrUndefined,
    assertStringOrUndefined,
    assertStringArrayOrUndefined,
    assertNumberOrUndefined,
    assertObjectOrUndefined,
} from "@/tool/type-check"

export default class LoadersService implements LoadersServiceInterface {
    /**
     * Loaders can be put in cache because it's a definition that cannot
     * change during Brayns execution.
     */
    private static loaders?: LoaderDefinition[]

    constructor(private readonly brayns: BraynsServiceInterface) {}

    async addModel(params: AddModelParams): Promise<any> {
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

function isLoadersExtensionDefArray(data: any): data is LoadersExtensionDef[] {
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
    data: any,
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
    assertObject(data, prefix)
    const { additionalProperties, properties, required, title, type } = data
    assertBooleanOrUndefined(
        additionalProperties,
        `${prefix}.additionalProperties`
    )
    assertObjectOrUndefined(properties, `${prefix}.properties`)
    if (properties) {
        for (const propName of Object.keys(properties)) {
            const prop = properties[propName]
            assertLoadersSchemaProperty(
                prop,
                `${prefix}.properties.${propName}`
            )
        }
    }
    assertStringArrayOrUndefined(required, `${prefix}.required`)
    assertStringOrUndefined(title, `${prefix}.title`)
    assertStringOrUndefined(type, `${prefix}.type`)
}

interface LoadersSchemaProperty {
    title?: string
    type?: string
    default?: string | number | boolean
    description?: string
    enum?: any[]
    minItems?: number
    maxItems?: number
    items?: { type: string }
}

/**
 * Throw a meaningful exception if `property` is not
 * of type `LoadersSchemaProperty`.
 */
function assertLoadersSchemaProperty(
    property: any,
    prefix: string
): asserts property is LoadersSchemaProperty {
    try {
        assertObject(property, prefix)
        const { title, type } = property
        assertStringOrUndefined(title, `${prefix}.title`)
        assertStringOrUndefined(type, `${prefix}.type`)
        assertStringOrUndefined(property.description, `${prefix}.description`)
        assertStringArrayOrUndefined(property.enum, `${prefix}.enum`)
        assertNumberOrUndefined(property.minItems, `${prefix}.minItems`)
        assertNumberOrUndefined(property.maxItems, `${prefix}.maxItems`)
    } catch (ex) {
        console.error(
            `Property "${prefix}" is not of type "LoadersSchemaProperty":`,
            property
        )
        throw ex
    }
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
