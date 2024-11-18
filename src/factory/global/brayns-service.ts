import BraynsServiceInterface, {
    BraynsServiceAddress,
} from "../../contract/service/brayns"
import BraynsService from "../../service/brayns"

import makeEvent from "./event"

const globalBraynsServices = new Map<string, BraynsServiceInterface>()

/**
 * This factory maintains a list with only one object per `host:name`.
 */
export default function makeBraynsService(
    braynsAddress: BraynsServiceAddress
): BraynsServiceInterface {
    const { host, port } = braynsAddress
    const key = `${host}:${port}`
    if (!globalBraynsServices.has(key)) {
        const brayns = new BraynsService(braynsAddress, makeEvent)
        globalBraynsServices.set(key, brayns)
    }
    return globalBraynsServices.get(key) as BraynsServiceInterface
}
