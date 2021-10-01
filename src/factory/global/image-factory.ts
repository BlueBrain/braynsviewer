import ImageFactoryInterface from "../../contract/factory/image"
import ImageFactory from "../image"

let globalImageFactory: ImageFactoryInterface | undefined

/**
 * @returns Image factory singleton.
 */
export default function makeImageFactory(): ImageFactoryInterface {
    if (!globalImageFactory) globalImageFactory = new ImageFactory()
    return globalImageFactory
}
