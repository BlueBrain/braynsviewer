/**
 * This type can be converted to/from a string.
 */
type SerializableData =
    | null
    | number
    | string
    | boolean
    | [number, number, number]
    | [number, number, number, number]
    | SerializableData[]
    | { [key: string]: SerializableData }

export default SerializableData
