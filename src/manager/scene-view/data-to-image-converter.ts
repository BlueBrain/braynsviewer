import { makeImageFactory } from "../../factory/global"

/**
 * This class acts as a buffer. We can get more calls to `setData()`
 * than to `getImage()` because Brayns is fast to produce images,
 * but the browser cannot keep up and we will probably throttle
 * the canvas refresh.
 * On the other hand, the browser can ask for the image if it needs
 * to resize the canvas. In this case, we can have several calls to
 * `getImage()` in a row.
 *
 * That's why this class is responsible of minimizing the number of
 * image creation from the ArrayBuffer.
 */
export default class DataToImageConverter {
    private readonly factory = makeImageFactory()
    private data: ArrayBuffer = new ArrayBuffer(0)
    private image?: HTMLImageElement

    setData(data: ArrayBuffer) {
        this.data = data
        delete this.image
    }

    async getImage(): Promise<HTMLImageElement> {
        if (this.image) return this.image

        const image = await this.factory.fromArrayBuffer(this.data)
        this.image = image
        return image
    }
}
