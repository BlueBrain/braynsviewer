import { isArray, isObject, isType } from "@/tool/type-check"
import BraynsServiceInterface, {
    BraynsUpdate,
} from "../../contract/service/brayns"
import RendererServiceInterface, {
    RendererCommonParams,
    RendererCommonParamsInput,
    RendererExtraParams,
} from "../../contract/service/renderer"
import { TriggerableEventInterface } from "../../contract/tool/event"

const SET_COMMON_PARAMS = "set-renderer"
const GET_COMMON_PARAMS = "get-renderer"
const SET_EXTRA_PARAMS = "set-renderer-params"
const GET_EXTRA_PARAMS = "get-renderer-params"

export default class RendererService implements RendererServiceInterface {
    public readonly eventCommonParamsChange: TriggerableEventInterface<RendererCommonParams>
    public readonly eventExtraParamsChange: TriggerableEventInterface<RendererExtraParams>

    constructor(
        private readonly brayns: BraynsServiceInterface,
        makeEvent: <T>() => TriggerableEventInterface<T>
    ) {
        this.eventCommonParamsChange = makeEvent<RendererCommonParams>()
        this.eventExtraParamsChange = makeEvent<RendererExtraParams>()
        brayns.eventUpdate.add(this.handleBraynsUpdate)
    }

    async setCommonParams(
        params: Partial<RendererCommonParamsInput>
    ): Promise<void> {
        await this.brayns.exec(SET_COMMON_PARAMS, {
            current: params.type,
            accumulation: params.accumulation,
            background_color: params.backgroundColor,
            head_light: params.headLight,
            max_accum_frames: params.maxAccumFrames,
            samples_per_pixel: params.samplesPerpixel,
            subsampling: params.subsampling,
            variance_threshold: params.varianceThreshold,
        })
    }

    async getCommonParams(): Promise<RendererCommonParams> {
        const data = await this.brayns.exec(GET_COMMON_PARAMS)
        if (!isBraynsRenderer(data)) {
            console.error(data)
            throw new Error(
                `"${GET_COMMON_PARAMS}" returned an unexpected result!`
            )
        }
        return castRendererCommonParams(data)
    }

    async setExtraParams(params: RendererExtraParams): Promise<void> {
        await this.brayns.exec(SET_EXTRA_PARAMS, params)
    }

    async getExtraParams(): Promise<RendererExtraParams> {
        const data = await this.brayns.exec(GET_EXTRA_PARAMS)
        if (!data || typeof data !== "object") {
            console.error(data)
            throw new Error(
                `"${GET_EXTRA_PARAMS}" returned an unexpected result!`
            )
        }
        return ensureRendererExtraParams(data)
    }

    private readonly handleBraynsUpdate = (update: BraynsUpdate) => {
        if (update.name === SET_COMMON_PARAMS)
            this.updateRendererCommonParams(update.value)
        else if (update.name === SET_EXTRA_PARAMS)
            this.updateRendererExtraParams(update.value)
    }

    private readonly updateRendererCommonParams = (value: unknown) => {
        if (!isBraynsRenderer(value)) {
            console.error(
                "Renderer common update has an unexpected format:",
                value
            )
            return
        }
        this.eventCommonParamsChange.trigger(castRendererCommonParams(value))
    }

    private readonly updateRendererExtraParams = (value: unknown) => {
        this.eventExtraParamsChange.trigger(ensureRendererExtraParams(value))
    }
}

interface BraynsRenderer {
    current: string
    accumulation: boolean
    background_color: [number, number, number]
    head_light: boolean
    max_accum_frames: number
    samples_per_pixel: number
    subsampling: number
    types: string[]
    variance_threshold: number
}

function isBraynsRenderer(data: unknown): data is BraynsRenderer {
    return isType(data, {
        current: "string",
        accumulation: "number",
        background_color: ["array(3)", "number"],
        head_light: "boolean",
        max_accum_frames: "number",
        samples_per_pixel: "number",
        subsampling: "number",
        types: ["array", "string"],
        variance_threshold: "number",
    })
}

type ExtraParam = number | string | boolean | [number, number, number]

function isExtraParam(data: unknown): data is ExtraParam {
    if (isArray(data)) {
        const [r, g, b] = data
        if (typeof r !== "number") return false
        if (typeof g !== "number") return false
        if (typeof b !== "number") return false
        return true
    }

    switch (typeof data) {
        case "number":
        case "string":
        case "boolean":
            return true
        default:
            return false
    }
}

function ensureRendererExtraParams(data: unknown) {
    if (!data || typeof data !== "object") {
        console.warn()
        return {}
    }

    if (!isObject(data)) return {}

    const extraParams: RendererExtraParams = {}
    for (const key of Object.keys(data)) {
        const val = data[key]
        if (!isExtraParam(val)) {
            console.warn(`Extra param "${key}" is of unknown type:`, val)
            extraParams[key] = ""
        } else {
            extraParams[key] = val
        }
    }
    return extraParams
}

function castRendererCommonParams(data: BraynsRenderer): RendererCommonParams {
    return {
        availableTypes: data.types,
        accumulation: data.accumulation,
        backgroundColor: data.background_color,
        headLight: data.head_light,
        maxAccumFrames: data.max_accum_frames,
        samplesPerpixel: data.samples_per_pixel,
        subsampling: data.subsampling,
        type: data.current,
        varianceThreshold: data.variance_threshold,
    }
}
