import EventInterface from "../tool/event"

export default interface BraynsServiceInterface {
    // Triggers when Brayns send us unsollicited updates.
    eventUpdate: EventInterface<BraynsUpdate>
    // Triggers when Brayns send us a new image of the scene.
    eventImage: EventInterface<ArrayBuffer>
    // `true` means that the WebSocket is connected.
    eventConnectionStatus: EventInterface<boolean>
    /** the host and port this is connected to. */
    readonly hostAndPort: string
    // Try yo connect to BraynsService. Throws an exception in case of failure.
    connect(): Promise<void>
    /**
     * Call a Brayns entryPoint and return the result.
     * Throws an exception in case of failure.
     * @param entryPointName "get-camera", "get-scene", 'add-light", ...
     * @param param A serializable param for the entry point.
     */
    exec(entryPointName: string, param?: unknown): Promise<unknown>

    /**
     * A long task can be cancelled and can provide progress feedbacks.
     * @see exec()
     * @param onProgress If defined, this function will be called with the current progress.
     * `value` is set between 0 and 1 (task completed).
     */
    execLongTask(
        entryPointName: string,
        param?: unknown,
        onProgress?: (progress: { value: number; label?: string }) => void
    ): LongTask
    /**
     * Execute a remote function and return the result object which tells you
     * if the query failed or succeded.
     * This method doesn't throw any exception.
     */
    tryToExec(
        entryPointName: string,
        param?: unknown
    ): Promise<BraynsQueryResult>
    /**
     * @see tryToExec()
     */
    isError(data: BraynsQueryResult): data is BraynsQueryFailure
    /**
     * @see tryToExec()
     */
    isSuccess(data: BraynsQueryResult): data is BraynsQuerySuccess
    /**
     * When debug mode is enabled, this service will log to the console
     * depending on the value of `debug`.
     * * `false`: Nothing is logged.
     * * `true`: Everything is logged.
     * * Regular expression: Log only entryPoints whose name match the regexp.
     * * Function: Log only if the function returns `true` for a given
     * entryPoint name and its parameters.
     */
    debug:
        | boolean
        | RegExp
        | ((entryPointName: string, params?: unknown) => boolean)
}

export interface LongTask {
    /**
     * Call this function to cancel the task before its normal end.
     * You will get an error in the promise though.
     */
    cancel(): void
    promise: Promise<unknown>
}

export interface BraynsUpdate {
    name: string
    value: unknown
}

export interface BraynsServiceAddress {
    host: string
    port: number
}

export type BraynsQueryResult = BraynsQuerySuccess | BraynsQueryFailure

interface BraynsQuery {
    entryPoint: string
    param?: unknown
}

export interface BraynsQuerySuccess extends BraynsQuery {
    success: true
    result: unknown
}

export interface BraynsQueryFailure extends BraynsQuery {
    success: false
    code: number
    message: string
    data?: unknown
}
