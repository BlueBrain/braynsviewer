import { BraynsServiceAddress } from "../../contract/service/brayns"
import CameraServiceInterface from "../../contract/service/camera"
import CameraService from "../../service/camera"
import makeBraynsService from "./brayns-service"
import makeEvent from "./event"

export default function makeCameraService(
    address: BraynsServiceAddress
): CameraServiceInterface {
    return new CameraService(makeBraynsService(address), makeEvent)
}
