import BraynsServiceInterface from "@/contract/service/brayns"
import LoadersServiceInterface, {
    AddModelParams,
    LoaderDefinition,
    LoaderPropertyDefinition
} from "@/contract/service/loaders"
import {
    isStringArray,
    tryArray,
    tryNumber,
    tryObject,
    tryString,
    tryStringArray
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
            await this.getLoadersPropertiesDefinitions(LoadersService.loaders)
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
     * By calling "loaders-schema" we get the detail of loaders properties.
     * That means human readable name, description and expected type.
     */
    private async getLoadersPropertiesDefinitions(loaders: LoaderDefinition[]) {
        const loadersSchema = await this.brayns.exec("loaders-schema")
        if (!isLoadersSchema(loadersSchema)) return

        for (const loaderSchema of loadersSchema.oneOf) {
            const loader = findLoader(loaders, loaderSchema.title)
            if (loader) completeProperties(loader, loaderSchema.properties)
        }
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
                properties: Object.keys(def.properties).map(propertyName => ({
                    name: propertyName,
                    // `title` will be defined by "schema-loaders".
                    // If not, we will use the technical name.
                    title: propertyName,
                    defaultValue: def.properties[propertyName],
                    type: "string",
                })),
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
    properties: { [key: string]: string | number | boolean | number[] }
}

function isLoadersExtensionDefArray(data: any): data is LoadersExtensionDef[] {
    try {
        tryArray(data)
        for (let i = 0; i < data.length; i++) {
            const item = data[i]
            tryLoadersExtensionDef(item, `data[${i}]`)
        }
        return true
    } catch (ex) {
        console.error(ex)
        return false
    }
}

function tryLoadersExtensionDef(data: any, prefix: string) {
    tryObject(data, prefix)
    const { name, extensions, properties } = data
    tryString(name, `${prefix}.name`)
    tryStringArray(extensions, `${prefix}.extensions`)
    tryObject(properties, `${prefix}.properties`)
}

interface LoadersSchema {
    title: "loaders"
    oneOf: Array<{
        title: string
        properties: {
            [key: string]: LoadersSchemaProperty
        }
    }>
}

interface LoadersSchemaProperty {
    title: string
    type: string
    description?: string
    enum?: any[]
    minItems?: number
    maxItems?: number
    items?: { type: string }
}

function isLoadersSchema(data: any): data is LoadersSchema {
    try {
        tryObject(data)
        if (data.title !== "loaders")
            throw Error('Value of data.title must be "loaders"!')
        const { oneOf } = data
        tryArray(oneOf, "data.oneOf")
        for (let i = 0; i < oneOf.length; i++) {
            const loader = oneOf[i]
            const prefix = `data.oneOf[${i}]`
            tryObject(loader, prefix)
            if (typeof loader.properties === "undefined") loader.properties = {}
            const { title, properties } = loader
            tryString(title, `${prefix}.title`)
            tryObject(properties, `${prefix}.properties`)
            for (const propertyName of Object.keys(properties)) {
                const property = properties[propertyName]
                tryLoadersSchemaProperty(
                    property,
                    `${prefix}.properties["${propertyName}"]`
                )
            }
        }
        return true
    } catch (ex) {
        console.error("This data is not of type LoadersSchema:", data)
        console.error(ex)
        return false
    }
}

/**
 * Throw a meaningful exception if `property` is not
 * of type `LoadersSchemaProperty`.
 */
function tryLoadersSchemaProperty(property: any, prefix: string) {
    tryObject(property, prefix)
    const { title, type } = property
    tryString(title, `${prefix}.title`)
    tryString(type, `${prefix}.type`)
    if (typeof property.description !== "undefined") {
        tryString(property.description, `${prefix}.description`)
    }
    if (typeof property.enum !== "undefined") {
        tryArray(property.enum, `${prefix}.enum`)
    }
    if (typeof property.minItems !== "undefined") {
        tryNumber(property.minItems, `${prefix}.minItems`)
    }
    if (typeof property.maxItems !== "undefined") {
        tryNumber(property.maxItems, `${prefix}.maxItems`)
    }
}

/**
 * Try to find a loader given its title.
 * @returns `null` if not found.
 */
function findLoader(
    loaders: LoaderDefinition[],
    title: string
): LoaderDefinition | null {
    const loader = loaders.find(item => item.name === title)
    if (typeof loader !== "undefined") return loader

    console.error(
        `Loader "${title}" is defined in "loaders-schema" but not in "get-loaders"!`
    )
    return null
}

function completeProperties(
    loader: LoaderDefinition,
    propertiesSchemas: { [key: string]: LoadersSchemaProperty }
) {
    for (const propertyName of Object.keys(propertiesSchemas)) {
        const property = loader.properties.find(p => p.name === propertyName)
        if (!property) {
            console.error(`Problem with definition of loader "${loader.name}"!`)
            console.error(
                `Property "${propertyName}" is defined in "schema-loaders" but not in "get-loaders"!`
            )
            continue
        }
        const propertySchema = propertiesSchemas[
            propertyName
        ] as LoadersSchemaProperty
        completeProperty(property, propertySchema)
    }
}

function completeProperty(
    property: LoaderPropertyDefinition,
    schema: LoadersSchemaProperty
) {
    property.title = schema.title
    property.description = schema.description
    if (isStringArray(schema.enum)) {
        property.type = schema.enum
        return
    }
    switch (schema.type) {
        case "string":
        case "number":
        case "boolean":
        case "integer":
            property.type = schema.type
            return
        case "array":
            completePropertyArray(property, schema)
            break
        default:
            console.error(
                `Don't know type "${schema.type}" of property "${property.name}"!`,
                property,
                schema
            )
    }
}

function completePropertyArray(
    property: LoaderPropertyDefinition,
    schema: LoadersSchemaProperty
) {
    const { minItems, maxItems } = schema
    property.minItems = minItems
    property.maxItems = maxItems
    const subType = schema.items?.type
    if (subType === "number") {
        if (minItems === 3 && maxItems === 3) {
            property.type = "vector3"
            return
        }
        if (minItems === 4 && maxItems === 4) {
            property.type = "vector4"
            return
        }
    }
    switch (subType) {
        case "integer":
        case "number":
        case "string":
            property.type = `${subType}[]`
            return
        default:
            throw Error(`Don't know how to deal with Array of "${subType}"!`)
    }
}
