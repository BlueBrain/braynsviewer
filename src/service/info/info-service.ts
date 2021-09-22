import InfoServiceInterface, {
    Version,
    Statistics
} from "../../contract/service/info"
import BraynsServiceInterface, {
    BraynsUpdate
} from "../../contract/service/brayns"
import { TriggerableEventInterface } from "../../contract/tool/event"

export default class InfoService implements InfoServiceInterface {
    public eventChange: TriggerableEventInterface<InfoServiceInterface>
    private _framesPerSecond = 0
    private _memoryUsage = 0

    constructor(
        private readonly brayns: BraynsServiceInterface,
        makeEvent: <T>() => TriggerableEventInterface<T>
    ) {
        this.eventChange = makeEvent()
        brayns.eventUpdate.add(this.handleBraynsUpdate)
    }

    get framesPerSecond() {
        return this._framesPerSecond
    }

    get memoryUsage() {
        return this._memoryUsage
    }

    async getStatistics(): Promise<Statistics> {
        const data = await this.brayns.exec(GET_STATISTICS)
        this.updateStatistics(data)
        return {
            framesPerSecond: this._framesPerSecond,
            memoryUsage: this._memoryUsage
        }
    }

    async getVersion(): Promise<Version> {
        const data = await this.brayns.exec(GET_VERSION)
        if (!isVersion(data)) {
            console.error("Received bad format when asking for version!", data)
            throw new Error("Bad version format!")
        }
        return data
    }

    private handleBraynsUpdate = (update: BraynsUpdate) => {
        if (update.name !== STATISTICS_UPDATE) return
        if (this.updateStatistics(update.value)) {
            this.eventChange.trigger(this)
        }
    }

    private updateStatistics(value: any): boolean {
        if (!isStatisticsResult(value)) {
            console.error("Bad format for statistics:", value)
            return false
        }
        this._framesPerSecond = value.fps
        this._memoryUsage = value.scene_size_in_bytes
        return true
    }
}

const GET_VERSION = "get-version"
const GET_STATISTICS = "get-statistics"
const STATISTICS_UPDATE = "set-statistics"

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

function isStatisticsResult(data: any): data is StatisticsResult {
    if (!data && typeof data !== "object") return false
    const { fps, scene_size_in_bytes } = data
    if (typeof fps !== "number") return false
    if (typeof scene_size_in_bytes !== "number") return false
    return true
}
