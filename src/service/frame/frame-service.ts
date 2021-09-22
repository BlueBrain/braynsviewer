import FrameServiceInterface, {
    Size,
    SnapshotOptions
} from "../../contract/service/frame"
import BraynsServiceInterface from "../../contract/service/brayns"
import ImageFactoryInterface from "../../contract/factory/image"

export default class FrameService implements FrameServiceInterface {
    constructor(
        private readonly brayns: BraynsServiceInterface,
        private readonly imageFactory: ImageFactoryInterface
    ) {}

    async getViewport(): Promise<Size> {
        const data = this.brayns.exec(GET_APPLICATION_PARAMETERS)
        try {
            if (!ensureHasViewport(data)) throw Error("Impossible!")
            const [width, height] = data.viewport
            return { width, height }
        } catch (ex) {
            console.error(
                `"${GET_APPLICATION_PARAMETERS}" returned an expected type:`,
                data
            )
            console.error(ex)
            throw ex
        }
    }
    async setViewPort(viewport: Size): Promise<void> {
        await this.brayns.exec(SET_APPLICATION_PARAMETERS, {
            viewport: [viewport.width, viewport.height]
        })
    }
    getFramePerSecondLimit(): Promise<number> {
        throw new Error("Method not implemented.")
    }
    setFramePerSecondLimit(fps: number): Promise<void> {
        throw new Error("Method not implemented.")
    }
    getCompressionQuality(): Promise<number> {
        throw new Error("Method not implemented.")
    }
    setCompressionQuality(quality: number): Promise<void> {
        throw new Error("Method not implemented.")
    }

    async takeSnapshot(options: SnapshotOptions): Promise<HTMLImageElement> {
        const task = this.brayns.execLongTask(SNAPSHOT, {
            format: options.transparent ? "PNG" : "JPEG",
            size: [options.width, options.height],
            samples_per_pixel: options.samplePerPixel
        })
        const { eventCancel } = options
        const cancel = () => task.cancel()
        if (eventCancel) eventCancel.add(cancel)
        try {
            const snapshot = await task.promise
            if (!ensureHasData(snapshot)) throw Error("Impossible!")
            const dataURI = `data:;base64,${snapshot.data}`
            return await this.imageFactory.fromURL(dataURI)
        } catch (ex) {
            console.error("Unable to take a snapshot:", options, ex)
            throw ex
        } finally {
            if (eventCancel) eventCancel.remove(cancel)
        }
    }
}

const GET_APPLICATION_PARAMETERS = "get-application-parameters"
const SET_APPLICATION_PARAMETERS = "set-application-parameters"
const SNAPSHOT = "snapshot"

function ensureHasViewport(data: any): data is { viewport: [number, number] } {
    ensureIsObject(data)
    const { viewport } = data
    if (!Array.isArray(viewport))
        throw Error("Data.viewport should be an array!")
    const [a, b] = viewport
    if (typeof a !== "number")
        throw Error("Data.viewport[0] should be a number!")
    if (typeof b !== "number")
        throw Error("Data.viewport[1] should be a number!")
    return true
}

function ensureHasData(snapshot: any): snapshot is { data: string } {
    ensureIsObject(snapshot)
    const { data } = snapshot
    if (typeof data !== "string")
        throw Error("snapshot.data should be a string!")
    return true
}

function ensureIsObject(data: any): data is { [key: string]: any } {
    if (!data) throw Error("Data is null or undefined!")
    if (Array.isArray(data)) throw Error("Data is an array!")
    if (typeof data !== "object") throw Error("Data is not an object")
    return true
}
