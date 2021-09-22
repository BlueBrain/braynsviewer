import { TypeDef } from "../type/type-definition"
export { TypeDef } from "../type/type-definition"

export interface EntryPointSchema {
    spawnAsyncTask: boolean
    description: string
    name: string
    params: TypeDef[]
    result: TypeDef
}

/**
 * Get information on available entry points.
 */
export default interface EntryPointsServiceInterface {
    listAvailableEntryPoints(): Promise<string[]>
    getEntryPointSchema(entryPointName: string): Promise<EntryPointSchema>
}

