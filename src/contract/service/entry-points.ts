import { TypeDef } from "../type/type-definition"
export { TypeDef } from "../type/type-definition"

export interface EntryPointSchema {
    spawnAsyncTask: boolean
    description: string
    name: string
    params: TypeDef
    result: TypeDef
}

/**
 * Get information on available entry points.
 */
export default interface EntryPointsServiceInterface {
    listAvailableEntryPoints(): Promise<string[]>
    getEntryPointSchema(entryPointName: string): Promise<EntryPointSchema>
    /**
     * Call a Brayns entryPoint and return the result.
     * Throws an exception in case of failure.
     * @param entryPointName "get-camera", "get-scene", 'add-light", ...
     * @param param A serializable param for the entry point.
     */
    exec(entryPointName: string, param?: unknown): Promise<unknown>
}
