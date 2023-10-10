import CameraServiceInterface, {
    CameraCommonParams,
    CameraExtraParams,
    isCameraExtraParams,
} from "@/contract/service/camera"
import { Quaternion, Vector3 } from "@/contract/tool/geometry"
import ButtonView from "@/ui/view/button"
import CheckboxView from "@/ui/view/checkbox"
import FloatInput from "@/ui/view/input/float"
import * as React from "react"
import Runnable from "../../view/runnable"
import "./camera-view.css"
import ExtraParamView from "./extra-param"
import SelectCamera from "./select-camera"

export interface CameraViewProps {
    className?: string
    cameraService: CameraServiceInterface
}

type RunnableFunction = (f: () => Promise<void>) => Promise<void>

export default function CameraView(props: CameraViewProps) {
    const { cameraService } = props
    const [transfo, setTransfo] = React.useState(REST_TRANSFO)
    const [type, setType] = React.useState("Undefined Camera")
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
        const init = () => {
            void run(async () => {
                const data = await cameraService.getCommonParams()
                setTransfo(data)
                setType(data.type)
                setTypes(data.availableTypes)
                setExtra(await cameraService.getExtraParams())
            })
        }
        if (!editMode) init()
        const handleCameraChange = (params: CameraCommonParams) => {
            if (editMode) return

            setTransfo(params)
            setType(params.type)
            setTypes(params.availableTypes)
            void run(async () => setExtra(await cameraService.getExtraParams()))
        }
        const handleCameraExtraChange = (params: CameraExtraParams) => {
            if (editMode) return

            setExtra(params)
        }
        cameraService.eventCommonParamsChange.add(handleCameraChange)
        cameraService.eventExtraParamsChange.add(handleCameraExtraChange)
        return () => {
            cameraService.eventCommonParamsChange.remove(handleCameraChange)
            cameraService.eventExtraParamsChange.remove(handleCameraExtraChange)
        }
    }, [cameraService, editMode])
    const handleApply = () => {
        void run(
            async () =>
                await cameraService.setCommonParams({
                    ...transfo,
                    type,
                })
        )
    }
    const handleChangeCameraType = async () => {
        const selectedType = await SelectCamera(type, types)
        if (!selectedType) return

        await run(async () => {
            await cameraService.setCommonParams({
                type: selectedType,
            })
            setType(selectedType)
            setExtra(await cameraService.getExtraParams())
        })
    }
    return (
        <div className={getClassNames(props)}>
            <Runnable running={running}>
                <h1>
                    Camera: "<code>{type}</code>"
                </h1>
                <header>
                    <CheckboxView
                        label={`Edit mode is ${editMode ? "ON" : "OFF"}`}
                        value={editMode}
                        onChange={setEditMode}
                    />
                    <ButtonView
                        label="Change type"
                        onClick={() => void handleChangeCameraType()}
                    />
                </header>
                <hr />
                <div className="transfo">
                    <div>
                        <div>Orientation:</div>
                        {transfo.orientation.map((v, i) => (
                            <FloatInput
                                key={i}
                                enabled={editMode}
                                size={8}
                                value={v}
                            />
                        ))}
                    </div>
                    <div>
                        <div>Position:</div>
                        {transfo.position.map((v, i) => (
                            <FloatInput
                                enabled={editMode}
                                key={i}
                                label={"XYZ".charAt(i)}
                                size={8}
                                value={v}
                            />
                        ))}
                    </div>
                    <div>
                        <div>Target:</div>
                        {transfo.target.map((v, i) => (
                            <FloatInput
                                enabled={editMode}
                                key={i}
                                label={"XYZ".charAt(i)}
                                size={8}
                                value={v}
                            />
                        ))}
                    </div>
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
                        onClick={handleApply}
                    />
                </div>
            </Runnable>
        </div>
    )
}

function getClassNames(props: CameraViewProps): string {
    const classNames = ["custom", "view-CameraView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}

interface CameraTransformation {
    position: Vector3
    target: Vector3
    orientation: Quaternion
}

const REST_TRANSFO: CameraTransformation = {
    position: [0, 0, -1],
    target: [0, 0, 0],
    orientation: [0, 0, 0, 1],
}

function notImplemented() {
    alert("Not implemented yet!")
}
