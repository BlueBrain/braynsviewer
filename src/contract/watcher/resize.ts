export type ResizeListenerInterface = (
    element: Element,
    width: number,
    height: number
) => void

export interface ResizeWatcherInterface {
    register(element: Element, resizeListener: ResizeListenerInterface): void
    unregister(element: Element, resizeListener: ResizeListenerInterface): void
}
