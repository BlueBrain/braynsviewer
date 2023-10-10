import SceneServiceInterface from "../../contract/service/scene"
import { BraynsServiceAddress } from "../../contract/service/brayns"
import makeBraynsService from "./brayns-service"
import makeEvent from "./event"
import SceneService from "../../service/scene/scene-service"

export default function makeSceneService(
    braynsAddress: BraynsServiceAddress
): SceneServiceInterface {
    return new SceneService(makeBraynsService(braynsAddress), makeEvent)
}
