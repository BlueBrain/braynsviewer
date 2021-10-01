import { ResizeWatcherInterface } from "../../contract/watcher/resize"
import ResizeWatcher from "../../watcher/resize"

let globalResizeWatcher: ResizeWatcherInterface | undefined

/**
 * @returns Resize Watcher singleton.
 */
export default function makeResizeWatcher(): ResizeWatcherInterface {
    if (!globalResizeWatcher) globalResizeWatcher = new ResizeWatcher()
    return globalResizeWatcher
}
