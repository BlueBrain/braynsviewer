import * as React from "react"
import Button from "../../ui/view/button"
import SceneServiceInterface, { Model } from "../../contract/service/scene"
import Runnable from "../runnable"
import ModelButton from "./model-button"

import "./scene-view.css"

export interface SceneViewProps {
    className?: string
    sceneService: SceneServiceInterface
}

export default function SceneView(props: SceneViewProps) {
    const { sceneService } = props
    const [models, setModels] = React.useState<Model[]>([])
    const [running, setRunning] = React.useState(true)
    const loadScene = React.useCallback(async () => {
        setRunning(true)
        try {
            const data = await sceneService.getScene()
            console.log("[scene-view] data = ", data) // @FIXME: Remove this line written on 2021-04-23 at 09:07
            setModels(data.models)
        } catch (ex) {
            console.error(ex)
        } finally {
            setRunning(false)
        }
    }, [sceneService])
    React.useEffect(() => {
        loadScene()
        const handleUpdate = () => {
            setModels(sceneService.models)
        }
        sceneService.eventChange.add(handleUpdate)
        return () => sceneService.eventChange.remove(handleUpdate)
    }, [loadScene, sceneService])
    return (
        <div className={getClassNames(props)}>
            <Runnable running={running}>
                <header>
                    <h1>
                        Scene: {models.length} model
                        {models.length > 1 ? "s" : ""}
                    </h1>
                    <Button label="Refresh" onClick={loadScene} />
                </header>
                <div className="models-list">
                    {models.map((model) => (
                        <ModelButton key={model.id} model={model} />
                    ))}
                </div>
            </Runnable>
        </div>
    )
}

function getClassNames(props: SceneViewProps): string {
    const classNames = ["custom", "view-SceneView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}
