import ObjectInterface from "../contract/tool/object"

const ObjectTool: ObjectInterface = {
    clone<T>(source: T): T {
        return structuredClone(source)
    },
}

export default ObjectTool
