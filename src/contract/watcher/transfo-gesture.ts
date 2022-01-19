import EventInterface from "../tool/event"

export interface TranslationEvent {
    /**
     * Relative to `xOrigin`.
     */
    x: number
    /**
     * Relative to `yOrigin`.
     */
    y: number
    /**
     * Absolute coord of first touch.
     */
    xOrigin: number
    /**
     * Absolute coord of first touch.
     */
    yOrigin: number
    isBegin: boolean
    isEnd: boolean
}

export default interface TransfoGestureWatcherInterface {
    readonly eventOrbit: EventInterface<TranslationEvent>
    readonly eventMove: EventInterface<TranslationEvent>
    readonly eventZoom: EventInterface<number>

    /**
     * The watched element.
     * This watcher works on only one element at the time,
     * if you reassign `element` the previous one will not
     * be watched anymore.
     */
    element: HTMLElement | SVGElement | undefined
}
