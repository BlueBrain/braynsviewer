export default interface ObjectInterface {
    /**
     * @param source Object to clone
     */
    clone<T>(source: T): T
}
