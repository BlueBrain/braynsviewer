import EventInterface from "../tool/event"

export default interface SceneViewManagerInterface {
    /**
     * Triggered every time a new image is painted on the canvas.
     */
    readonly eventRepaint: EventInterface<SceneViewManagerInterface>

    /**
     * @returns A canvas with the last image received from Brayns.
     */
    takeLocalSnapshot(): Promise<HTMLCanvasElement>

    /**
     * If not in auto refresh, you need to call `refresh()`
     * to get a new image from Brayns.
     * Otherwise, we will get new images as long as Brayns created them.
     */
    setAutoRefresh(autoRefreshEnabled: boolean): void

    /**
     * Get and display a new image from Brayns.
     * Works only if auto refresh mode has been disabled.
     * @param timeout Number max of milliseconds to wait for the image.
     * @returns `false` if nothing has been received before `timeout`.
     */
    refresh(timeout: number): Promise<boolean>

    getView(): JSX.Element

    get locked(): boolean
    set locked(value: boolean)
}
