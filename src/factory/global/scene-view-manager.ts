import SceneViewManagerInterface from "../../contract/manager/scene-view-manager"
import { BraynsServiceAddress } from "../../contract/service/brayns"

import makeBraynsService from "./brayns-service"
import makeCameraService from "./camera-service"
import makeEvent from "./event"
import makeGeometry from "./geometry"
import makeTransfoGestureWatcher from "./transfo-gesture-watcher"

import SceneViewManager from '../../manager/scene-view'

/**
 * Return a new scene view manager for this `braynsAddress`.
 */
export default function makeSceneViewManager(
    braynsAddress: BraynsServiceAddress
): SceneViewManagerInterface {
    return new SceneViewManager(
        makeBraynsService(braynsAddress),
        makeGeometry(),
        makeCameraService(braynsAddress),
        makeTransfoGestureWatcher(),
        makeEvent
    )
}
