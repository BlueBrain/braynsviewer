import { TriggerableEventInterface } from "../../contract/tool/event"
import Event from "../../tool/event"

export default function makeEvent<T>(): TriggerableEventInterface<T> {
    return new Event<T>()
}
