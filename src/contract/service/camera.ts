import EventInterface from "../tool/event"
import { Quaternion, Vector3 } from "../tool/geometry"

export interface CameraTransformation {
    orientation: Quaternion
    target: Vector3
    position: Vector3
}

export interface CameraCommonParamsInput extends CameraTransformation {
    type: string
}

export interface CameraCommonParams extends CameraCommonParamsInput {
    availableTypes: string[]
}

export interface CameraExtraParams {
    [key: string]: number | boolean | string
}

export default interface CameraServiceInterface {
    readonly eventCommonParamsChange: EventInterface<CameraCommonParams>
    readonly eventExtraParamsChange: EventInterface<CameraExtraParams>
    setCommonParams(params: Partial<CameraCommonParamsInput>): Promise<void>
    getCommonParams(): Promise<CameraCommonParams>
    setExtraParams(params: CameraExtraParams): Promise<void>
    getExtraParams(): Promise<CameraExtraParams>
}
