import { makeBraynsService } from "."
import { BraynsServiceAddress } from "../../contract/service/brayns"
import EntryPointsServiceInterface from "../../contract/service/entry-points"
import EntryPointsService from "../../service/entry-points"

export default function makeEntryPointsService(
    braynsAddress: BraynsServiceAddress
): EntryPointsServiceInterface {
    return new EntryPointsService(makeBraynsService(braynsAddress))
}
