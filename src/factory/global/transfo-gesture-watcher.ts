import TransfoGestureWatcherInterface from "../../contract/watcher/transfo-gesture"
import TransfoGestureWatcher from "../../watcher/transfo-gesture"
import makeEvent from "./event"

export default function makeTransfoGestureWatcher(): TransfoGestureWatcherInterface {
    return new TransfoGestureWatcher(makeEvent)
}
