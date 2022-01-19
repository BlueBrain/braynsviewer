import BraynsServiceInterface, { BraynsUpdate } from "@/contract/service/brayns"
import SceneServiceInterface, { Model, Scene } from "@/contract/service/scene"
import { TriggerableEventInterface } from "@/contract/tool/event"
import { BoundingBox, Quaternion, Vector3 } from "@/contract/tool/geometry"
import { isArray, isVector3, isVector4 } from "@/tool/type-check"

export default class SceneService implements SceneServiceInterface {
    readonly eventChange: TriggerableEventInterface<SceneServiceInterface>

    constructor(
        private readonly brayns: BraynsServiceInterface,
        makeEvent: <T>() => TriggerableEventInterface<T>
    ) {
        this.eventChange = makeEvent()
        brayns.eventUpdate.add(this.handleBraynsUpdate)
    }

    get boundingBox(): BoundingBox {
        return this._boundingBox
    }

    get models(): Model[] {
        return this._models
    }

    async getScene(): Promise<Scene> {
        const data = await this.brayns.exec(GET_SCENE)
        if (!isBraynsScene(data)) {
            console.error("Bad scene format:", data)
            throw new Error("Bad scene format!")
        }
        this.update(data)
        return {
            boundingBox: this._boundingBox,
            models: this._models,
        }
    }

    private _models: Model[] = []
    private _boundingBox: BoundingBox = {
        min: [0, 0, 0],
        max: [1, 1, 1],
    }

    private handleBraynsUpdate = (update: BraynsUpdate) => {
        if (update.name !== SCENE_UPDATE) return

        const data = update.value
        if (!isBraynsScene(data)) {
            console.error("Bad scene format:", data)
            return
        }
        this.update(data)
        this.eventChange.trigger(this)
    }

    private update(data: BraynsScene) {
        this._boundingBox = data.bounds
        this._models = data.models.map((model) => ({
            boundingBox: model.bounds,
            boundingBoxVisible: model.bounding_box,
            id: model.id,
            loaderName: model.loader_name,
            metadata: model.metadata,
            name: model.name,
            path: model.path,
            transformation: {
                orientation: model.transformation.rotation,
                rotationCenter: model.transformation.rotation_center,
                scale: model.transformation.scale,
                translation: model.transformation.translation,
            },
            visible: model.visible,
        }))
    }
}

const GET_SCENE = "get-scene"
const SCENE_UPDATE = "set-scene"

interface BraynsScene {
    bounds: BoundingBox
    models: BraynsModel[]
}

interface BraynsModel {
    bounding_box: boolean
    bounds: BoundingBox
    id: number
    loader_name: string
    metadata: { [key: string]: string }
    name: string
    path: string
    transformation: BraynsModelTransformation
    visible: boolean
}

interface BraynsModelTransformation {
    rotation: Quaternion
    rotation_center: Vector3
    scale: Vector3
    translation: Vector3
}

function isBraynsScene(data: any): data is BraynsScene {
    if (!data || typeof data !== "object") return false
    const { bounds, models } = data
    if (!isBoundingBox(bounds)) return false
    if (!isArray(models)) return false
    for (const model of models) {
        if (!isBraynsModel(model)) return false
    }
    return true
}

function isBraynsModel(data: any): data is BraynsModel {
    if (!data || typeof data !== "object") return false
    const {
        bounding_box,
        bounds,
        id,
        loader_name,
        metadata,
        name,
        path,
        transformation,
        visible,
    } = data
    if (typeof bounding_box !== "boolean") return false
    if (!isBoundingBox(bounds)) return false
    if (typeof id !== "number") return false
    if (typeof loader_name !== "string") return false
    if (!isMetadata(metadata)) return false
    if (typeof name !== "string") return false
    if (typeof path !== "string") return false
    if (!isTransformation(transformation)) return false
    if (typeof visible !== "boolean") return false
    return true
}

function isBoundingBox(data: any): data is BoundingBox {
    if (!data || typeof data !== "object") return false
    const { min, max } = data
    if (!isVector3(min)) return false
    if (!isVector3(max)) return false
    return true
}

function isMetadata(data: any): data is { [key: string]: string } {
    if (!data || typeof data !== "object") return false
    return true
}

function isTransformation(data: any): data is BraynsModelTransformation {
    if (!data || typeof data !== "object") return false
    const { rotation, rotation_center, translation, scale } = data
    if (!isVector3(rotation_center)) return false
    if (!isVector3(translation)) return false
    if (!isVector3(scale)) return false
    if (!isVector4(rotation)) return false
    return true
}
