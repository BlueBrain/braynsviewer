import SceneViewManagerInterface from "@/contract/manager/scene-view-manager"
import * as React from 'react'
import { confirmLock, confirmUnlock } from "./lock-confirm"

export function useScreenLock(
    sceneView: SceneViewManagerInterface
): [locked: boolean, toggleLocked: ()=>void] {
    const [locked, setLocked] = React.useState(sceneView.locked)
    const toggleLocked = React.useCallback(() => {
        const later = async () => {
            console.log("🚀 [app-view] sceneView.locked = ", sceneView.locked) // @FIXME: Remove this line written on 2021-07-20 at 10:30
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
        later()
    }, [sceneView])
    return [locked, toggleLocked]
}

