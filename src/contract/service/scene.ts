import EventInterface from "../tool/event"
import { BoundingBox, Quaternion, Vector3 } from "../tool/geometry"

export default interface SceneServiceInterface {
    /**
     * Triggered anytime a model (3D object) is added or removed from the scene.
     */
    readonly eventChange: EventInterface<SceneServiceInterface>
    /**
     * The smallest box that contain all the models of the scene.
     */
    readonly boundingBox: BoundingBox
    /**
     * List of models currently loaded in the scene.
     */
    readonly models: Model[]
    getScene(): Promise<Scene>
    removeModel(modelId: number): Promise<void>
}

export interface Scene {
    models: Model[]
    boundingBox: BoundingBox
}

export interface Model {
    id: number
    name: string
    path: string
    visible: boolean
    boundingBox: BoundingBox
    boundingBoxVisible: boolean
    metadata: { [key: string]: string }
    loaderName: string
    transformation: {
        orientation: Quaternion
        translation: Vector3
        scale: Vector3
        rotationCenter: Vector3
    }
}
