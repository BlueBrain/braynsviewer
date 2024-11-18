import { BraynsServiceAddress } from "@/contract/service/brayns"
import SpontaneousUpdatesServiceInterface from "@/contract/service/spontaneous-updates"
import SpontaneousUpdatesService from "../../service/spontaneous-updates"
import makeBraynsService from "./brayns-service"
import makeEvent from "./event"

/**
 * This factory maintains a list with only one object per `host:name`.
 */
export default function makeSpontaneousUpdatesService(
    braynsAddress: BraynsServiceAddress
): SpontaneousUpdatesServiceInterface {
    return new SpontaneousUpdatesService(
        makeBraynsService(braynsAddress),
        makeEvent
    )
}
