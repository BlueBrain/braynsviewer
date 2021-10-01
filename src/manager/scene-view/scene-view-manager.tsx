import React from "react"
import SceneViewManagerInterface from "../../contract/manager/scene-view-manager"
import BraynsServiceInterface from "../../contract/service/brayns"
import CameraServiceInterface from "../../contract/service/camera"
import { TriggerableEventInterface } from "../../contract/tool/event"
import GeometryInterface, { Size } from "../../contract/tool/geometry"
import TransfoGestureWatcherInterface from "../../contract/watcher/transfo-gesture"
import CameraTransfoManager from "./camera-transfo-manager"
import DataToImageConverter from "./data-to-image-converter"
import SceneCanvasView from "./scene-canvas-view"

/**
 * Manage the Canvas that can display Brayns images.
 */
export default class SceneViewManager implements SceneViewManagerInterface {
    public readonly eventRepaint: TriggerableEventInterface<SceneViewManagerInterface>
    private readonly cameraTransfoManager: CameraTransfoManager
    /** If the view is locked, you cannot move the camera, nor change the viewport. */
    private _locked = true

    constructor(
        private readonly brayns: BraynsServiceInterface,
        private readonly geometry: GeometryInterface,
        private readonly camera: CameraServiceInterface,
        private readonly transfoGestureWatcher: TransfoGestureWatcherInterface,
        makeEvent: <T>() => TriggerableEventInterface<T>
    ) {
        this.cameraTransfoManager = new CameraTransfoManager(
            geometry,
            camera,
            transfoGestureWatcher
        )
        this.cameraTransfoManager.enabled = !this._locked
        this.eventRepaint = makeEvent<SceneViewManagerInterface>()
        brayns.eventImage.add(this.handleImageFromBrayns)
        this.view = (
            <SceneCanvasView
                onCanvasReady={this.handleCanvasReady}
                onSizeChange={this.handleSizeChange}
            />
        )
        // Mode "quanta" means that we will only receive frames when we are ready.
        brayns
            .exec("image-streaming-mode", { type: "quanta" })
            .then(this.acceptNextFrame)
    }

    get locked() {
        return this._locked
    }
    set locked(value: boolean) {
        this._locked = value
        this.cameraTransfoManager.enabled = !value
        if (value === false) {
            this.acceptNextFrame()
        }
    }

    async takeLocalSnapshot(): Promise<HTMLCanvasElement> {
        const image = await this.buffer.getImage()
        const canvas = window.document.createElement("canvas")
        canvas.width = image.width
        canvas.height = image.height
        const ctx = canvas.getContext("2d")
        ctx?.drawImage(image, 0, 0)
        return canvas
    }

    setAutoRefresh(autoRefreshEnabled: boolean) {
        this.autoRefreshEnabled = autoRefreshEnabled
    }

    async refresh(timeout: number = 500): Promise<boolean> {
        console.log("refesh ", timeout, this.autoRefreshEnabled)
        if (this.autoRefreshEnabled) return true

        await this.brayns.exec("trigger-jpeg-stream")

        return new Promise(resolve => {
            window.setTimeout(resolve, timeout)
        })
    }

    getView(): JSX.Element {
        return this.view
    }

    // #################### PRIVATE ####################

    private readonly buffer = new DataToImageConverter()
    private canvas?: HTMLCanvasElement
    private autoRefreshEnabled = true
    private readonly view: JSX.Element

    /**
     * Tell Brayns Service that we are ready to receive the next frame.
     */
    public acceptNextFrame = () => {
        const { brayns } = this
        brayns.exec("trigger-jpeg-stream")
    }

    private readonly handleCanvasReady = (canvas: HTMLCanvasElement) => {
        this.canvas = canvas
        this.transfoGestureWatcher.element = canvas
    }

    private readonly handleImageFromBrayns = async (data: ArrayBuffer) => {
        this.buffer.setData(data)
        await this.paintCurrentImage()
        this.acceptNextFrame()
        this.eventRepaint.trigger(this)
    }

    private async paintCurrentImage() {
        const { canvas } = this
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const img = await this.buffer.getImage()
        const { x, y, width, height } = this.geometry.fitToCover(img, canvas)
        ctx.drawImage(img, x, y, width, height)
    }

    private readonly handleSizeChange = async (size: Size) => {
        await this.paintCurrentImage()
    }
}
