import RendererServiceInterface, {
    RendererCommonParams,
    RendererExtraParams,
} from "@/contract/service/renderer"
import ButtonView from "@/ui/view/button"
import CheckboxView from "@/ui/view/checkbox"
import FloatInput from "@/ui/view/input/float"
import * as React from "react"
import Runnable from "../runnable"
import ExtraParamView from "./extra-param"
import SelectRenderer from "./select-renderer"

import "./renderer-view.css"
import { isCameraExtraParams } from "@/contract/service/camera"

export interface RendererViewProps {
    className?: string
    rendererService: RendererServiceInterface
}

type RunnableFunction = (f: () => Promise<void>) => Promise<void>

export default function RendererView(props: RendererViewProps) {
    const { rendererService } = props
    const [params, setParams] =
        React.useState<RendererCommonParams>(DEFAULT_PARAMS)
    const [type, setType] = React.useState("Undefined Renderer")
    const [types, setTypes] = React.useState(["perspective", "orthographic"])
    const [extra, setExtra] = React.useState<unknown>(null)
    const [editMode, setEditMode] = React.useState(false)
    const [running, setRunning] = React.useState(true)
    const run: RunnableFunction = async (f) => {
        try {
            setRunning(true)
            return await f()
        } catch (ex) {
            console.error(ex)
            alert(`${ex}`)
        } finally {
            setRunning(false)
        }
    }
    React.useEffect(() => {
        const init = async () => {
            await run(async () => {
                const data = await rendererService.getCommonParams()
                setParams(data)
                setType(data.type)
                setTypes(data.availableTypes)
                setExtra(await rendererService.getExtraParams())
            })
        }
        if (!editMode) void init()
        const handleRendererChange = async (params: RendererCommonParams) => {
            if (editMode) return

            setParams(params)
            setType(params.type)
            setTypes(params.availableTypes)
            await run(async () =>
                setExtra(await rendererService.getExtraParams())
            )
        }
        const handleRendererExtraChange = (params: RendererExtraParams) => {
            if (editMode) return

            setExtra(params)
        }
        rendererService.eventCommonParamsChange.add(
            (params: RendererCommonParams) => void handleRendererChange(params)
        )
        rendererService.eventExtraParamsChange.add(handleRendererExtraChange)
        return () => {
            rendererService.eventCommonParamsChange.remove(
                (params: RendererCommonParams) =>
                    void handleRendererChange(params)
            )
            rendererService.eventExtraParamsChange.remove(
                handleRendererExtraChange
            )
        }
    }, [rendererService, editMode])
    const handleApply = async () => {
        await run(
            async () =>
                await rendererService.setCommonParams({
                    ...params,
                    type,
                })
        )
    }
    const handleChangeRendererType = async () => {
        const selectedType = await SelectRenderer(type, types)
        if (!selectedType) return

        await run(async () => {
            await rendererService.setCommonParams({
                type: selectedType,
            })
            setType(selectedType)
            setExtra(await rendererService.getExtraParams())
        })
    }
    const updateParam = (param: Partial<RendererCommonParams>) => {
        setParams({
            ...params,
            ...param,
        })
    }
    return (
        <div className={getClassNames(props)}>
            <Runnable running={running}>
                <h1>
                    Renderer: "<code>{type}</code>"
                </h1>
                <header>
                    <CheckboxView
                        label={`Edit mode is ${editMode ? "ON" : "OFF"}`}
                        value={editMode}
                        onChange={setEditMode}
                    />
                    <ButtonView
                        label="Change type"
                        onClick={() => void handleChangeRendererType()}
                    />
                </header>
                <hr />
                <div className="common">
                    <CheckboxView
                        enabled={editMode}
                        label={`Accumulation is ${
                            params.accumulation ? "ON" : "OFF"
                        }`}
                        value={params.accumulation}
                        onChange={(accumulation) =>
                            updateParam({ accumulation })
                        }
                    />
                    <CheckboxView
                        enabled={editMode}
                        label={`Head Light is ${
                            params.headLight ? "ON" : "OFF"
                        }`}
                        value={params.headLight}
                        onChange={(headLight) => updateParam({ headLight })}
                    />
                    <FloatInput
                        enabled={editMode}
                        size={8}
                        value={params.maxAccumFrames}
                        label="Max Accu. Frames"
                        onChange={(maxAccumFrames) =>
                            updateParam({ maxAccumFrames })
                        }
                    />
                    <FloatInput
                        enabled={editMode}
                        size={8}
                        value={params.samplesPerpixel}
                        label="Samples per Pixel"
                        onChange={(samplesPerpixel) =>
                            updateParam({ samplesPerpixel })
                        }
                    />
                    <FloatInput
                        enabled={editMode}
                        size={8}
                        value={params.subsampling}
                        label="Subsampling"
                        onChange={(subsampling) => updateParam({ subsampling })}
                    />
                    <FloatInput
                        enabled={editMode}
                        size={8}
                        value={params.varianceThreshold}
                        label="Variance Threshold"
                        onChange={(varianceThreshold) =>
                            updateParam({ varianceThreshold })
                        }
                    />
                </div>
                {isCameraExtraParams(extra) && (
                    <>
                        <hr />
                        <div className="extra-params">
                            {Object.keys(extra).map((name) => (
                                <ExtraParamView
                                    key={name}
                                    enabled={editMode}
                                    params={extra}
                                    name={name}
                                    onChange={setExtra}
                                />
                            ))}
                        </div>
                    </>
                )}
                <hr />
                <div className="center">
                    <ButtonView
                        enabled={editMode}
                        label="Load"
                        onClick={notImplemented}
                    />
                    <ButtonView
                        enabled={editMode}
                        label="Save"
                        onClick={notImplemented}
                    />
                    <ButtonView
                        enabled={editMode}
                        label="Apply"
                        color="accent"
                        onClick={() => void handleApply()}
                    />
                </div>
            </Runnable>
        </div>
    )
}

function getClassNames(props: RendererViewProps): string {
    const classNames = ["custom", "view-RendererView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}

const DEFAULT_PARAMS: RendererCommonParams = {
    accumulation: true,
    availableTypes: [],
    backgroundColor: [0, 0, 0],
    headLight: false,
    maxAccumFrames: 128,
    samplesPerpixel: 1,
    subsampling: 1,
    type: "...",
    varianceThreshold: -1,
}

function notImplemented() {
    alert("Not implemented yet!")
}
