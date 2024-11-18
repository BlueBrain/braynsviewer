import { BraynsServiceAddress } from "@/contract/service/brayns"
import RendererServiceInterface from "@/contract/service/renderer"
import RendererService from "../../service/renderer"
import makeBraynsService from "./brayns-service"
import makeEvent from "./event"

export default function makeRendererService(
    address: BraynsServiceAddress
): RendererServiceInterface {
    return new RendererService(makeBraynsService(address), makeEvent)
}
