import {
    ResizeListenerInterface,
    ResizeWatcherInterface,
} from "../../contract/watcher/resize"

interface Listener {
    element: Element
    listeners: ResizeListenerInterface[]
}

export default class ResizeWatcher implements ResizeWatcherInterface {
    private readonly observer: ResizeObserver
    private listeners: Listener[] = []

    constructor() {
        this.observer = new ResizeObserver(this.handleObserverCallback)
    }

    register(element: Element, resizeListener: ResizeListenerInterface) {
        if (!this.hasElementListener(element)) {
            this.observer.observe(element)
            this.listeners.push({ element, listeners: [] })
        }
        const listener = this.getElementListener(element)
        listener.listeners.push(resizeListener)
    }

    unregister(element: Element, resizeListener: ResizeListenerInterface) {
        if (!this.hasElementListener(element)) return

        const listener = this.getElementListener(element)
        listener.listeners = listener.listeners.filter(
            (item) => item === resizeListener
        )
        if (listener.listeners.length === 0) {
            this.observer.unobserve(element)
            this.listeners = this.listeners.filter((item) => item === listener)
        }
    }

    private hasElementListener(element: Element): boolean {
        for (const listener of this.listeners) {
            if (listener.element === element) return true
        }
        return false
    }

    private getElementListener(element: Element): Listener {
        for (const listener of this.listeners) {
            if (listener.element === element) return listener
        }
        throw new Error(
            "No listener found! You should use hasElementListener()."
        )
    }

    private readonly handleObserverCallback: ResizeObserverCallback = (
        entries
    ) => {
        for (const entry of entries) {
            const elem = entry.target
            if (this.hasElementListener(elem)) {
                const listener = this.getElementListener(elem)
                const { width, height } = entry.contentRect
                for (const resizeListener of listener.listeners) {
                    resizeListener(elem, width, height)
                }
            }
        }
    }
}
