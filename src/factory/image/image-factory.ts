import ImageFactoryInterface from "../../contract/factory/image"

export default class ImageFactory implements ImageFactoryInterface {
    async fromURL(url: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            const img = new Image()
            img.src = url
            img.onload = () => resolve(img)
            img.onerror = reject
        })
    }

    async fromArrayBuffer(arrayBuffer: ArrayBuffer): Promise<HTMLImageElement> {
        const blob = new Blob([arrayBuffer])
        return this.fromBlob(blob)
    }

    async fromBlob(blob: Blob): Promise<HTMLImageElement> {
        const url = URL.createObjectURL(blob)
        const img = new Image()
        return new Promise<HTMLImageElement>((resolve) => {
            img.src = url
            // Https://medium.com/dailyjs/image-loading-with-image-decode-b03652e7d2d2
            if (img.decode) {
                img.decode()
                    .then(() => resolve(img))
                    .catch(console.error)
            } else {
                img.onload = () => resolve(img)
            }
        })
    }
}
