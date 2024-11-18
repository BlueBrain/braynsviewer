import InfoServiceInterface from "../../contract/service/info"
import { BraynsServiceAddress } from "../../contract/service/brayns"
import InfoService from "../../service/info"
import { makeBraynsService } from "."
import makeEvent from "./event"

export default function makeInfoService(
    braynsAddress: BraynsServiceAddress
): InfoServiceInterface {
    return new InfoService(makeBraynsService(braynsAddress), makeEvent)
}
