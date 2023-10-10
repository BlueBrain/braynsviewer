export default interface ImageFactoryInterface {
    fromArrayBuffer(arrayBuffer: ArrayBuffer): Promise<HTMLImageElement>
    fromURL(url: string): Promise<HTMLImageElement>
}
