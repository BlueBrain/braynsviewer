import BraynsServiceInterface from "@/contract/service/brayns"
import { formatValueAsPythonObject } from "./helpers/format"
import { makeApiFunction } from "./makers/api"
import { makeComment } from "./makers/comment"
import { makeLoadModels } from "./makers/load-models"
import { stringify } from "./stringify"
import { surround } from "./helpers/surround"
import {
    PythonScripting,
    ScriptingFactoryInterface,
} from "@/contract/factory/scripting"

const ScriptingFactory: ScriptingFactoryInterface = {
    stringify,
    makeApiFunction,
    makeLoadModels,
    makeScriptHeader,
    makeInitCamera: async (
        brayns: BraynsServiceInterface
    ): Promise<PythonScripting> => {
        const camera = await brayns.exec("get-camera")
        const cameraParams = await brayns.exec("get-camera-params")
        return [
            ...makeComment("Initilializing Camera..."),
            `print("Initilializing Camera...")`,
            ...surround(
                `exec("set-camera", `,
                formatValueAsPythonObject(camera),
                `)`
            ),
            ...surround(
                `exec("set-camera-params", `,
                formatValueAsPythonObject(cameraParams),
                `)`
            ),
        ]
    },
    makeInitRenderer: async (
        brayns: BraynsServiceInterface
    ): Promise<PythonScripting> => {
        const renderer = await brayns.exec("get-renderer")
        const rendererParams = await brayns.exec("get-renderer-params")
        return [
            ...makeComment("Initilializing Renderer..."),
            `print("Initilializing Renderer...")`,
            ...surround(
                `exec("set-renderer", `,
                formatValueAsPythonObject(renderer),
                ")"
            ),
            ...surround(
                `exec("set-renderer-params", `,
                formatValueAsPythonObject(rendererParams),
                `)`
            ),
        ]
    },
}

export default ScriptingFactory

async function makeScriptHeader(
    brayns: BraynsServiceInterface
): Promise<PythonScripting> {
    const version = await brayns.exec("get-version")
    return {
        imports: ["sys"],
        code: [
            ...makeComment(
                "This script is supposed to work with Brayns Renderer",
                JSON.stringify(version),
                "",
                "Usage:",
                `   python script.py "${brayns.hostAndPort}"`
            ),
            "if len(sys.argv) < 2:",
            [
                `print("")`,
                `print("Usage:")`,
                `print("    python", sys.argv[0], "${brayns.hostAndPort}")`,
                `print("")`,
                `print("Where ${brayns.hostAndPort} has to be replaced with the address of a Brayns Renderer running instance.")`,
                `print("")`,
                "sys.exit(1)",
            ],
        ],
    }
}
;``
