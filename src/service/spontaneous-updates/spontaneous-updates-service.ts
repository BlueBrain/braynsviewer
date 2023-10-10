import BraynsServiceInterface, { BraynsUpdate } from "@/contract/service/brayns"
import SpontaneousUpdatesServiceInterface, {
    SpontaneousUpdateItem,
    SpontaneousUpdateItemValue,
} from "@/contract/service/spontaneous-updates"
import { TriggerableEventInterface } from "@/contract/tool/event"

export default class SpontaneousUpdatesService
    implements SpontaneousUpdatesServiceInterface
{
    public readonly eventNewUpdate: TriggerableEventInterface<SpontaneousUpdatesServiceInterface>

    constructor(
        brayns: BraynsServiceInterface,
        makeEvent: <T>() => TriggerableEventInterface<T>
    ) {
        this.eventNewUpdate = makeEvent<SpontaneousUpdatesServiceInterface>()
        brayns.eventUpdate.add(this.handleBraynsUpdate)
    }

    get updatesHistory(): SpontaneousUpdateItem[] {
        const items: SpontaneousUpdateItem[] = []
        for (const [name, values] of this.history.entries()) {
            items.push({
                name,
                values: values.map((v) => structuredClone(v)),
            })
        }
        return items
    }

    get historyLimit() {
        return this.limit
    }
    set historyLimit(limit: number) {
        this.limit = limit
    }

    // ### Private ###

    private limit = 8
    private readonly history = new Map<string, SpontaneousUpdateItemValue[]>()

    /**
     * @param update Last received Brayns spontaneous update.
     */
    private readonly handleBraynsUpdate = (update: BraynsUpdate) => {
        try {
            const { history } = this
            const item: SpontaneousUpdateItemValue = {
                timestamp: Date.now(),
                value: update.value,
            }
            const list = history.get(update.name)
            if (list) {
                list.unshift(item)
                list.splice(this.limit, list.length)
            } else {
                history.set(update.name, [item])
            }
        } catch (ex) {
            console.error("Unexpected exception!", ex)
        } finally {
            this.eventNewUpdate.trigger(this)
        }
    }
}
