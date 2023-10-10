import BraynsServiceInterface from "@/contract/service/brayns"
import Code from "../../factory/scripting"
import Modal from "@/ui/modal"

export async function generatePythonCode(
    brayns: BraynsServiceInterface
): Promise<string> {
    const generate = async () =>
        Code.stringify([
            await Code.makeScriptHeader(brayns),
            await Code.makeApiFunction(),
            await Code.makeInitRenderer(brayns),
            await Code.makeInitCamera(brayns),
            await Code.makeLoadModels(brayns),
        ])
    return Modal.wait("Generating script...", generate())
}
