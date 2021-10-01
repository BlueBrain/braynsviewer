import EventInterface from "../tool/event"

export interface Version {
    major: number
    minor: number
    patch: number
    revision: string
}

/**
 * Deals with Brayns's information.
 * Like version, statistics, ...
 */
export default interface InfoServiceInterface {
    readonly version: Version
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
