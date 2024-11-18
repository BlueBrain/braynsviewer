import EventInterface from "../../contract/tool/event"

export default interface FrameServiceInterface {
    getViewport(): Promise<Size>
    setViewPort(viewport: Size): Promise<void>

    getFramePerSecondLimit(): Promise<number>
    setFramePerSecondLimit(fps: number): Promise<void>

    getCompressionQuality(): Promise<number>
    /**
     * Frames are compressed before being sent.
     * @param quality 0 (worst) to 1 (best).
     */
    setCompressionQuality(quality: number): Promise<void>

    takeSnapshot(options: SnapshotOptions): Promise<HTMLImageElement>
}

export interface Size {
    width: number
    height: number
}

export interface SnapshotOptions {
    width: number
    height: number
    transparent: boolean
    /**
     * Number of samples to average t get the final image.
     * If undefined, take the current setting.
     */
    samplePerPixel?: number
    /**
     * If this event is triggered before the end of the process,
     * the snapshot is cancelled.
     */
    eventCancel?: EventInterface<void>
    /**
     * Taking a snapshot can take a while. This function will be called
     * during the process to report progress.
     * @param progress.value Percentage of progress between 0 and 1.
     */
    onProgress?(progress: { value: number; label?: string }): void
}
