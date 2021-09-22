import EventInterface from "../tool/event"

export interface Version {
    major: number
    minor: number
    patch: number
    revision: string
}

export interface Statistics {
    framesPerSecond: number
    memoryUsage: number
}

/**
 * Deals with Brayns's information.
 * Like version, statistics, ...
 */
export default interface InfoServiceInterface {
    getVersion(): Promise<Version>
    getStatistics(): Promise<Statistics>
    /**
     * Number of frames rendered on server side per second.
     */
    readonly framesPerSecond: number
    /**
     * Expressed in bytes.
     */
    readonly memoryUsage: number
    /**
     * Triggered when `framesPerSecond` or `memoryUsage` has changed.
     */
    readonly eventChange: EventInterface<InfoServiceInterface>
}
