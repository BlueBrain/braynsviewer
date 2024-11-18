import { makeBraynsService } from "."
import { BraynsServiceAddress } from "../../contract/service/brayns"
import LoadersServiceInterface from "../../contract/service/loaders"
import LoadersService from "../../service/loaders"

export default function makeLoadersService(
    braynsAddress: BraynsServiceAddress
): LoadersServiceInterface {
    return new LoadersService(makeBraynsService(braynsAddress))
}
