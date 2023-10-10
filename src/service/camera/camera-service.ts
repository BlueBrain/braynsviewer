import BraynsServiceInterface, { BraynsUpdate } from "@/contract/service/brayns"
import CameraServiceInterface, {
    CameraCommonParams,
    CameraCommonParamsInput,
    CameraExtraParams,
} from "@/contract/service/camera"
import { TriggerableEventInterface } from "@/contract/tool/event"
import { Quaternion, Vector3 } from "@/contract/tool/geometry"
import { assertType } from "@/tool/type-check"

const SET_COMMON_PARAMS = "set-camera"
const GET_COMMON_PARAMS = "get-camera"
const SET_EXTRA_PARAMS = "set-camera-params"
const GET_EXTRA_PARAMS = "get-camera-params"

export default class CameraService implements CameraServiceInterface {
    public readonly eventCommonParamsChange: TriggerableEventInterface<CameraCommonParams>
    public readonly eventExtraParamsChange: TriggerableEventInterface<CameraExtraParams>

    constructor(
        private readonly brayns: BraynsServiceInterface,
        makeEvent: <T>() => TriggerableEventInterface<T>
    ) {
        this.eventCommonParamsChange = makeEvent<CameraCommonParams>()
        this.eventExtraParamsChange = makeEvent<CameraExtraParams>()
        brayns.eventUpdate.add(this.handleBraynsUpdate)
    }

    async setCommonParams(
        params: Partial<CameraCommonParamsInput>
    ): Promise<void> {
        await this.brayns.exec(SET_COMMON_PARAMS, {
            current: params.type,
            orientation: params.orientation,
            position: params.position,
            target: params.target,
        })
    }

    async getCommonParams(): Promise<CameraCommonParams> {
        const data = await this.brayns.exec(GET_COMMON_PARAMS)
        if (!isBraynsCamera(data)) {
            console.error(data)
            throw new Error(
                `"${GET_COMMON_PARAMS}" returned an unexpected result!`
            )
        }
        return castCameraCommonParams(data)
    }

    async setExtraParams(params: CameraExtraParams): Promise<void> {
        await this.brayns.exec(SET_EXTRA_PARAMS, params)
    }

    async getExtraParams(): Promise<CameraExtraParams> {
        const data = await this.brayns.exec(GET_EXTRA_PARAMS)
        if (!data || typeof data !== "object") {
            console.error(data)
            throw new Error(
                `"${GET_EXTRA_PARAMS}" returned an unexpected result!`
            )
        }
        return ensureCameraExtraParams(data)
    }

    private readonly handleBraynsUpdate = (update: BraynsUpdate) => {
        if (update.name === SET_COMMON_PARAMS)
            this.updateCameraCommonParams(update.value)
        else if (update.name === SET_EXTRA_PARAMS)
            this.updateCameraExtraParams(update.value)
    }

    private readonly updateCameraCommonParams = (value: unknown) => {
        if (!isBraynsCamera(value)) {
            console.error(
                "Camera common update has an unexpected format:",
                value
            )
            return
        }
        this.eventCommonParamsChange.trigger(castCameraCommonParams(value))
    }

    private readonly updateCameraExtraParams = (value: unknown) => {
        this.eventExtraParamsChange.trigger(ensureCameraExtraParams(value))
    }
}

interface BraynsCamera {
    current: string
    orientation: Quaternion
    target: Vector3
    position: Vector3
    types: string[]
}

function isBraynsCamera(data: unknown): data is BraynsCamera {
    try {
        assertType(data, {
            current: "string",
            orientation: ["array(4)", "number"],
            position: ["array(3)", "number"],
            target: ["array(3)", "number"],
            types: ["array", "string"],
        })
        return true
    } catch (ex) {
        console.error(ex)
        return false
    }
}

type ExtraParam = number | string | boolean

function isExtraParam(data: unknown): data is ExtraParam {
    switch (typeof data) {
        case "string":
        case "number":
        case "boolean":
            return true
        default:
            return false
    }
}

function ensureCameraExtraParams(data: unknown) {
    try {
        assertType<Record<string, string | number | boolean>>(data, [
            "map",
            ["|", "string", "number", "boolean"],
        ])
    } catch (ex) {
        console.error(ex)
        return {}
    }
    if (!data || typeof data !== "object") {
        console.warn()
        return {}
    }
    const extraParams: CameraExtraParams = {}
    for (const key of Object.keys(data)) {
        const val = data[key]
        if (!isExtraParam(val)) {
            console.warn(`Extra param "${key}" is of unknown type:`, val)
        }
        extraParams[key] = val
    }
    return extraParams
}

function castCameraCommonParams(data: BraynsCamera): CameraCommonParams {
    return {
        availableTypes: data.types,
        orientation: data.orientation,
        position: data.position,
        target: data.target,
        type: data.current,
    }
}
