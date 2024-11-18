import BraynsServiceInterface from "@/contract/service/brayns"
import { formatValueAsPythonObject } from "../helpers/format"
import { makeComment } from "./comment"
import { PythonScripting } from "@/contract/factory/scripting"
import {
    isObject,
    isString,
    assertArray,
    assertBoolean,
    assertNumber,
    assertObject,
    assertString,
    assertVector3,
    assertVector4,
} from "@/tool/type-check"

export async function makeLoadModels(
    brayns: BraynsServiceInterface
): Promise<PythonScripting> {
    const scene = await brayns.exec("get-scene")
    assertObject(scene, "scene")
    const { models } = scene
    assertArray(models, "scene.models")
    console.log("🚀 [scripting-factory] scene = ", scene) // @FIXME: Remove this line written on 2022-03-01 at 16:12
    return [
        makeComment("Load all models into the scene."),
        models.filter(isLoadableMesh).map(loadModel),
    ]
}

interface Model {
    id: number
    loader_name: string
    loader_properties: unknown
    path: string
    transformation: {
        rotation: [number, number, number, number]
        rotation_center: [number, number, number]
        scale: [number, number, number]
        translation: [number, number, number]
    }
    visible: boolean
}

/**
 * We don't have enough information to reload some models,
 * like generated meshes.
 */
function isLoadableMesh(model: unknown) {
    if (!isObject(model)) return false
    const { loader_name } = model
    if (!isString(loader_name)) return false
    return loader_name !== "mesh"
}

function assertModel(data: unknown, text = "model"): asserts data is Model {
    assertObject(data, text)
    const { id, loader_name, path, transformation, visible } = data
    assertNumber(id, `${text}.id`)
    assertString(loader_name, `${text}.loader_name`)
    assertString(path, `${text}.path`)
    assertBoolean(visible, `${text}.visible`)
    assertObject(transformation, `${text}.transformation`)
    const { rotation, rotation_center, scale, translation } = transformation
    assertVector4(rotation, `${text}.transformation.rotation`)
    assertVector3(rotation_center, `${text}.transformation.rotation_center`)
    assertVector3(scale, `${text}.transformation.scale`)
    assertVector3(translation, `${text}.transformation.translation`)
}

function loadModel(model: unknown, index: number) {
    assertModel(model, `scene.models[${index}]`)
    const params = formatValueAsPythonObject(
        {
            loader_name: model.loader_name,
            loader_properties: model.loader_properties,
            path: model.path,
            transformation: model.transformation,
            visible: model.visible,
        },
        `model_${model.id} = exec("add-model", `,
        ")"
    )
    console.log("🚀 [load-models] params = ", params) // @FIXME: Remove this line written on 2022-03-02 at 08:53
    return [
        `print("Loading ${model.loader_name}:",`,
        [`"${model.path}")`],
        ...params,
    ]
}
