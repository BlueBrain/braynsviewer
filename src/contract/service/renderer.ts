import EventInterface from "../tool/event"

export interface RendererCommonParamsInput {
    accumulation: boolean
    backgroundColor: [number, number, number]
    headLight: boolean
    maxAccumFrames: number
    samplesPerpixel: number
    subsampling: number
    type: string
    varianceThreshold: number
}

export interface RendererCommonParams extends RendererCommonParamsInput {
    availableTypes: string[]
}

export interface RendererExtraParams {
    [key: string]: number | boolean | string | [number, number, number]
}

export default interface RendererServiceInterface {
    readonly eventCommonParamsChange: EventInterface<RendererCommonParams>
    readonly eventExtraParamsChange: EventInterface<RendererExtraParams>
    setCommonParams(params: Partial<RendererCommonParamsInput>): Promise<void>
    getCommonParams(): Promise<RendererCommonParams>
    setExtraParams(params: RendererExtraParams): Promise<void>
    getExtraParams(): Promise<RendererExtraParams>
}
