import { TypeObjectDef } from "../type/type-definition"

export interface RendererExplorerInterface {
    getRendererNames(): Promise<string[]>
    getRendererDefinition(cameraName: string): Promise<RendererDefinition>
}

export interface RendererDefinition {
    name: string
    properties: TypeObjectDef
}
