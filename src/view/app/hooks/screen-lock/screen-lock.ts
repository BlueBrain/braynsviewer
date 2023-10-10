import SceneViewManagerInterface from "@/contract/manager/scene-view-manager"
import * as React from "react"
import { confirmLock, confirmUnlock } from "./lock-confirm"

export function useScreenLock(
    sceneView: SceneViewManagerInterface
): [locked: boolean, toggleLocked: () => void] {
    const [locked, setLocked] = React.useState(sceneView.locked)
    const toggleLocked = React.useCallback(() => {
        const later = async () => {
            if (sceneView.locked) {
                if (await confirmUnlock()) {
                    setLocked(false)
                    sceneView.locked = false
                }
            } else {
                if (await confirmLock()) {
                    setLocked(true)
                    sceneView.locked = true
                }
            }
        }
        void later()
    }, [sceneView])
    return [locked, toggleLocked]
}
