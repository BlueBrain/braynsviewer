import EventInterface from "../tool/event"

/**
 * In JSON RPC protocol, we can attach responses of messages we sent
 * when we receive messages that bear the same ID.
 * For instance if you send `getCamera({id: 666})`, vou will eventually
 * receive a WebSocket message like this `{id: 666, camera: ...}`.
 *
 * But you can also receice messages without any ID. Such messages are
 * called spontaneous and they are Brayns state updates broadcasted to
 * every client.
 */
export default interface SpontaneousUpdatesServiceInterface {
    // We received a new update.
    readonly eventNewUpdate: EventInterface<SpontaneousUpdatesServiceInterface>
    // Copy of the updates items.
    readonly updatesHistory: SpontaneousUpdateItem[]
    // Maximum number of values to keep for each update.
    historyLimit: number
}

export interface SpontaneousUpdateItem {
    name: string
    values: SpontaneousUpdateItemValue[]
}

export interface SpontaneousUpdateItemValue {
    timestamp: number
    value: unknown
}
