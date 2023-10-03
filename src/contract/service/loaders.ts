export type LoaderPropertyTypeDefinition =
    | "string"
    | "number"
    | "boolean"
    | "integer"
    // An array of exactly 3 floats.
    | "vector3"
    // An array of exactly 4 floats.
    | "vector4"
    // An enumerate of strings.
    | string[]
    | "integer[]" // An array of integers. Look at `minItems` and `maxItems` for size.
    | "number[]" // An array of floats. Look at `minItems` and `maxItems` for size.
    | "string[]" // An array of strings. Look at `minItems` and `maxItems` for size.

export interface LoaderPropertyDefinition {
    // Atribute name (ex: 002RandomSeed).
    name: string
    // Display name (ex: Random seed for target subsetting).
    title: string
    defaultValue?: unknown
    description?: string
    type?: LoaderPropertyTypeDefinition
    minItems?: number
    maxItems?: number
}

export interface LoaderDefinition {
    name: string
    extensions: string[]
    properties: LoaderPropertyDefinition[]
}

export interface AddModelParams {
    bounding_box?: boolean
    loader_name: string
    loader_properties?: { [key: string]: unknown }
    name?: string
    path: string
    transformation?: {
        rotation?: [number, number, number, number]
        rotation_center?: [number, number, number]
        scale?: [number, number, number]
        translation?: [number, number, number]
    }
    visible?: boolean
}

/**
 * Get information on available loaders.
 */
export default interface LoadersServiceInterface {
    listAvailableLoaders(): Promise<LoaderDefinition[]>
    /**
     *
     * @param params
     */
    addModel(params: AddModelParams): Promise<unknown>
}
