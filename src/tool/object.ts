import ObjectInterface from "../contract/tool/object"

const ObjectTool: ObjectInterface = {
    clone<T>(source: T): T {
        return JSON.parse(JSON.stringify(source))
    },
}

export default ObjectTool
