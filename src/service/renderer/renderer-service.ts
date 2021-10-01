import { TriggerableEventInterface } from "../../contract/tool/event"
import BraynsServiceInterface, {
    BraynsUpdate
} from "../../contract/service/brayns"
import RendererServiceInterface, {
    RendererCommonParams,
    RendererCommonParamsInput,
    RendererExtraParams
} from "../../contract/service/renderer"

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
            variance_threshold: params.varianceThreshold
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

    private handleBraynsUpdate = (update: BraynsUpdate) => {
        if (update.name === SET_COMMON_PARAMS)
            this.updateRendererCommonParams(update.value)
        else if (update.name === SET_EXTRA_PARAMS)
            this.updateRendererExtraParams(update.value)
    }

    private updateRendererCommonParams = (value: any) => {
        if (!isBraynsRenderer(value)) {
            console.error(
                "Renderer common update has an unexpected format:",
                value
            )
            return
        }
        this.eventCommonParamsChange.trigger(castRendererCommonParams(value))
    }

    private updateRendererExtraParams = (value: any) => {
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

function isBraynsRenderer(data: any): data is BraynsRenderer {
    if (!data || typeof data !== "object") return false
    const {
        current,
        accumulation,
        background_color,
        head_light,
        max_accum_frames,
        samples_per_pixel,
        subsampling,
        types,
        variance_threshold
    } = data
    if (typeof current !== "string") return false
    if (typeof max_accum_frames !== "number") return false
    if (typeof samples_per_pixel !== "number") return false
    if (typeof subsampling !== "number") return false
    if (typeof variance_threshold !== "number") return false
    if (typeof accumulation !== "boolean") return false
    if (typeof head_light !== "boolean") return false
    if (!isVector3(background_color)) return false
    if (!Array.isArray(types)) return false
    for (const type of types) {
        if (typeof type !== "string") return false
    }
    return true
}

function isVector3(data: any): data is [number, number, number] {
    if (!Array.isArray(data)) return false
    if (data.length !== 3) return false
    for (const item of data) {
        if (typeof item !== "number") return false
    }
    return true
}

type ExtraParam = number | string | boolean | [number, number, number]

function isExtraParam(data: any): data is ExtraParam {
    if (Array.isArray(data)) {
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

function ensureRendererExtraParams(data: any) {
    if (!data || typeof data !== "object") {
        console.warn()
        return {}
    }
    const extraParams: RendererExtraParams = {}
    for (const key of Object.keys(data)) {
        const val = data[key]
        if (!isExtraParam(val)) {
            console.warn(`Extra param "${key}" is of unknown type:`, val)
        }
        extraParams[key] = val
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
        varianceThreshold: data.variance_threshold
    }
}
