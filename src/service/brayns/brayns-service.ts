import BraynsServiceInterface, {
    BraynsQueryFailure,
    BraynsQueryResult,
    BraynsQuerySuccess,
    BraynsServiceAddress,
    BraynsUpdate,
    LongTask,
} from "../../contract/service/brayns"
import { TriggerableEventInterface } from "../../contract/tool/event"
import SerializableData from "../../contract/type/serializable-data"

/**
 * Used to generate unique IDs for WebSockets queries.
 */
let globalIncrementalId = 0

interface PendingQuery {
    id: string
    entryPointName: string
    param?: unknown
    resolve(result: BraynsQueryResult): void
}

export default class BraynsService implements BraynsServiceInterface {
    // By default, log nothing to the console (unless there is an error).
    debug:
        | boolean
        | RegExp
        | ((entryPointName: string, params?: any) => boolean) = false
    // For spontaneous updates coming from BraynsService.
    public readonly eventUpdate: TriggerableEventInterface<BraynsUpdate>
    // For scene images.
    public readonly eventImage: TriggerableEventInterface<ArrayBuffer>
    // `true` if WebSocket is connected.
    public readonly eventConnectionStatus: TriggerableEventInterface<boolean>

    constructor(
        braynsAddress: BraynsServiceAddress,
        makeEvent: <T>() => TriggerableEventInterface<T>
    ) {
        this.host = braynsAddress.host
        this.port = braynsAddress.port
        this.eventImage = makeEvent<ArrayBuffer>()
        this.eventUpdate = makeEvent<BraynsUpdate>()
        this.eventConnectionStatus = makeEvent<boolean>()
    }

    /**
     * @throws `{ code: number, message: string, data?: unknown }`
     */
    async exec(entryPointName: string, param?: unknown): Promise<unknown> {
        const data = await this.tryToExec(entryPointName, param)
        if (this.isError(data)) {
            console.error(
                `Brayns query failure for entryPoint "${entryPointName}"!`
            )
            console.error("    Params:", param)
            console.error("    Error: ", data)
            // eslint-disable-next-line no-throw-literal
            throw { code: data.code, message: data.message, data: data.data }
        }
        return data.result
    }

    execLongTask(entryPointName: string, param?: unknown): LongTask {
        const { ws } = this
        if (!ws) throw Error("BraynsService is not connected yet!")

        const id = this.nextId()
        const message = {
            jsonrpc: "2.0",
            id,
            method: entryPointName,
            params: param,
        }
        const promise = new Promise<unknown>((resolve, reject) => {
            this.pendingQueries.set(id, {
                id,
                entryPointName,
                param,
                resolve: (data: BraynsQueryResult) => {
                    if (this.isError(data)) {
                        reject(`${data.message} (#${data.code})`)
                        return
                    }

                    resolve(data.result)
                },
            })
            try {
                ws.send(JSON.stringify(message))
            } catch (ex) {
                console.error(
                    "Unable to send a message through WebSocket: ",
                    ex
                )
                this.pendingQueries.delete(id)
                reject(ex)
            }
        })
        return {
            promise,
            cancel() {
                ws.send(
                    JSON.stringify({
                        jsonrpc: "2.0",
                        method: "cancel",
                        params: { id },
                    })
                )
            },
        }
    }

    isError(data: BraynsQueryResult): data is BraynsQueryFailure {
        return !data.success
    }

    isSuccess(data: BraynsQueryResult): data is BraynsQuerySuccess {
        return data.success
    }

    async connect(): Promise<void> {
        if (this.ws) {
            this.ws.close()
            delete this.ws
        }
        return new Promise((resolve, reject) => {
            const url = this.getWebSocketURL()
            console.log("🚀 [brayns-service] url = ", url) // @FIXME: Remove this line written on 2022-01-13 at 10:14
            const protocol = "rockets"
            const handleError = (ex) => {
                console.error(
                    `Unable to connect to Brayns Service on "${url}"!`,
                    ex
                )
                reject(`Unable to connect to Brayns Service on "${url}"!`)
            }
            const handleConnectionSuccess = () => {
                const { ws } = this
                if (!ws) return

                ws.removeEventListener("open", handleConnectionSuccess)
                ws.removeEventListener("error", handleError)
                resolve()
            }
            try {
                console.log(
                    `Connecting "${url}" with protocol "${protocol}"...`
                )
                const ws = new WebSocket(url, [protocol])
                this.ws = ws
                // This is very IMPORTANT!
                // With blobs, we have weird bugs when trying to
                // get the videostreaming messages without binaryType = "arraybuffer".
                ws.binaryType = "arraybuffer"
                ws.addEventListener("message", this.handleMessage)
                ws.addEventListener("close", this.handleClose)
                ws.addEventListener("open", this.handleOpen)
                ws.addEventListener("error", this.handleError)
                ws.addEventListener("error", handleError)
                ws.addEventListener("open", handleConnectionSuccess)
            } catch (ex) {
                console.error(`Connection failed to ${url}!`, ex)
                reject(ex)
            }
        })
    }

    async tryToExec(
        entryPointName: string,
        params?: unknown
    ): Promise<BraynsQueryResult> {
        if (!this.ws) throw Error("BraynsService is not connected yet!")

        return new Promise((resolve, reject) => {
            const id = this.nextId()
            const message = {
                jsonrpc: "2.0",
                id,
                method: entryPointName,
                params: params,
            }
            this.pendingQueries.set(id, {
                id,
                entryPointName,
                param: params,
                resolve,
            })
            try {
                const payload = JSON.stringify(message)
                if (this.isDebugEnabled(entryPointName, params)) {
                    console.log(">>>", entryPointName, params, id)
                }
                this.ws?.send(payload)
            } catch (ex) {
                console.log(">>>", entryPointName, params)
                console.error(
                    "Unable to send a message through WebSocket: ",
                    ex
                )
                this.pendingQueries.delete(id)
                reject(ex)
            }
        })
    }

    // #################### PRIVATE ####################

    private readonly host: string
    private readonly port: number
    private ws: WebSocket | undefined
    private readonly pendingQueries = new Map<string, PendingQuery>()
    private readonly resources = new Map<string, SerializableData>()

    private isDebugEnabled(entryPointName: string, params?: any): boolean {
        const { debug } = this
        if (debug === true || debug === false) return debug
        if (typeof debug === "function") {
            return debug(entryPointName, params)
        }
        debug.lastIndex = -1
        return debug.test(entryPointName)
    }

    private getWebSocketURL() {
        const RX_BB5_HOST = /^r[0-9]+i[0-9]+n[0-9]+$/g
        const { host, port } = this
        if (RX_BB5_HOST.test(host)) {
            // Add suffix for fully qualified name.
            return `ws://${host}.bbp.epfl.ch:${port}`
        }
        return `ws://${host}:${port}`
    }

    private handleMessage = (event: MessageEvent) => {
        console.log("🚀 [brayns-service] event = ", event) // @FIXME: Remove this line written on 2021-10-21 at 16:07
        if (typeof event.data === "string") {
            this.handleStringMessage(event.data)
        } else {
            console.log("eventImage.trigger", event.data)
            this.eventImage.trigger(event.data)
        }
    }

    private handleStringMessage(text: string) {
        try {
            const data = JSON.parse(text)
            const { id, method, result, params, error } = data
            if (typeof id === "undefined") {
                this.handleSpontaneousUpdate(method, params)
            } else if (typeof error !== "undefined") {
                this.handleResponseError(id, error)
            } else {
                this.handleResponse(id, result)
            }
        } catch (ex) {
            console.error("Unable to parse websocket incoming message:", ex)
            console.error("    text = ", text)
        }
    }

    private handleSpontaneousUpdate(name: string, value: SerializableData) {
        this.eventUpdate.trigger({ name, value })
    }

    private handleResponse(id: string, params: any) {
        const query = this.pendingQueries.get(id)
        if (typeof query === "undefined") {
            // Just ignore this message because it is not a response
            // to any of our queries.
            return
        }

        this.pendingQueries.delete(id)
        if (this.isDebugEnabled(query.entryPointName, params)) {
            console.log("<<<", query.entryPointName, params, id)
        }
        const result: BraynsQueryResult = {
            success: true,
            result: params,
            entryPoint: query.entryPointName,
            param: query.param,
        }
        query.resolve(result)
    }

    private handleResponseError(id: string, error: any) {
        const query = this.pendingQueries.get(id)
        if (typeof query === "undefined") {
            // Just ignore this message because it is not a response
            // to any of our queries.
            return
        }

        this.pendingQueries.delete(id)
        query.resolve({
            success: false,
            code: error.code ?? 0,
            message: error.message ?? "Unknown error!",
            data: error.data,
            entryPoint: query.entryPointName,
            param: query.param,
        })
    }

    /**
     * @returns Next available ID in Base64 encoding.
     */
    private nextId(): string {
        return btoa(`${globalIncrementalId++}`)
    }

    private handleError = (event) => {
        console.error("### [WS] Error:", event)
    }

    private readonly handleClose = () => {
        this.eventConnectionStatus.trigger(false)
    }

    private readonly handleOpen = () => {
        this.eventConnectionStatus.trigger(true)
    }
}
