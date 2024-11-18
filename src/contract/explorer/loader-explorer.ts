import { TypeObjectDef } from "../type/type-definition"

export interface LoaderExplorerInterface {
    /**
     * @returns List of names of registered loaders.
     */
    getLoaderNames(): Promise<string[]>
    /**
     * @returns List of names of loaders registred for this extension.
     */
    getLoaderNamesForExtenstion(fileExtension: string): Promise<string[]>
    /**
     * @returns Definnition of a Loader. Raises an exception if the
     * loader has not been found.
     */
    getLoaderDef(loaderName: string): Promise<LoaderDef>
}

export interface LoaderDef {
    name: string
    description?: string
    fileExtensions: string[]
    properties: TypeObjectDef
}
