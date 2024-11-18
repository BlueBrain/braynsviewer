import { isType } from "@/tool/type-check"
import BraynsServiceInterface, {
    BraynsUpdate,
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
        brayns
            .exec(GET_STATISTICS)
            .then(this.updateStatistics)
            .catch(console.error)
        brayns.exec(GET_VERSION).then(this.updateVersion).catch(console.error)
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

    private readonly updateVersion = (data: unknown) => {
        if (!isVersion(data)) {
            console.error("Received bad format when asking for version!", data)
            throw new Error("Bad version format!")
        }
        this._version = data
        this.eventChange.trigger(this)
    }

    private readonly handleBraynsUpdate = (update: BraynsUpdate) => {
        if (update.name !== STATISTICS_UPDATE) return
        this.updateStatistics(update.value)
    }

    private readonly updateStatistics = (value: unknown): boolean => {
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
function isVersion(data: unknown): data is Version {
    return isType<Version>(data, {
        major: "number",
        minor: "number",
        patch: "number",
        revision: "string",
    })
}

interface StatisticsResult {
    fps: number
    scene_size_in_bytes: number
}

/**
 * Typecheck for statistics.
 */
function isStatisticsResult(data: unknown): data is StatisticsResult {
    return isType<StatisticsResult>(data, {
        fps: "number",
        scene_size_in_bytes: "number",
    })
}
