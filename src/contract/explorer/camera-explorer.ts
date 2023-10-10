import { TypeObjectDef } from "../type/type-definition"

export interface CameraExplorerInterface {
    getCameraNames(): Promise<string[]>
    getCameraDefinition(cameraName: string): Promise<CameraDefinition>
}

export interface CameraDefinition {
    name: string
    properties: TypeObjectDef
}
