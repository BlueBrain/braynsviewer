import BraynsServiceInterface, {
    BraynsUpdate
} from "../../contract/service/brayns"
import InfoServiceInterface, { Version } from "../../contract/service/info"
import { TriggerableEventInterface } from "../../contract/tool/event"

export default class InfoService implements InfoServiceInterface {
    public eventChange: TriggerableEventInterface<InfoServiceInterface>
    private _framesPerSecond = 0
    private _memoryUsage = 0
    private _version: Version = {
        major: 0,
        minor: 0,
        patch: 0,
        revision: "...",
    }

    constructor(
        private readonly brayns: BraynsServiceInterface,
        makeEvent: <T>() => TriggerableEventInterface<T>
    ) {
        this.eventChange = makeEvent()
        brayns.eventUpdate.add(this.handleBraynsUpdate)
        brayns.exec(GET_STATISTICS).then(this.updateStatistics)
        brayns.exec(GET_VERSION).then(this.updateVersion)
    }

    get version() {
        return this._version
    }

    get framesPerSecond() {
        return this._framesPerSecond
    }

    get memoryUsage() {
        return this._memoryUsage
    }

    private updateVersion = (data: any) => {
        if (!isVersion(data)) {
            console.error("Received bad format when asking for version!", data)
            throw new Error("Bad version format!")
        }
        this._version = data
        this.eventChange.trigger(this)
    }

    private handleBraynsUpdate = (update: BraynsUpdate) => {
        if (update.name !== STATISTICS_UPDATE) return
        this.updateStatistics(update.value)
    }

    private updateStatistics = (value: any): boolean => {
        if (!isStatisticsResult(value)) {
            console.error("Bad format for statistics:", value)
            return false
        }
        this._framesPerSecond = value.fps
        this._memoryUsage = value.scene_size_in_bytes
        this.eventChange.trigger(this)
        return true
    }
}

const GET_VERSION = "get-version"
const GET_STATISTICS = "get-statistics"
const STATISTICS_UPDATE = "set-statistics"

/**
 * Typecheck for version.
 */
function isVersion(data: any): data is Version {
    if (!data || typeof data !== "object") return false
    const { major, minor, patch, revision } = data
    if (typeof major !== "number") return false
    if (typeof minor !== "number") return false
    if (typeof patch !== "number") return false
    if (typeof revision !== "string") return false
    return true
}

interface StatisticsResult {
    fps: number
    scene_size_in_bytes: number
}

/**
 * Typecheck for statistics.
 */
function isStatisticsResult(data: any): data is StatisticsResult {
    if (!data && typeof data !== "object") return false
    const { fps, scene_size_in_bytes } = data
    if (typeof fps !== "number") return false
    if (typeof scene_size_in_bytes !== "number") return false
    return true
}
