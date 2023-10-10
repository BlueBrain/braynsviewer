import * as React from "react"
import Button from "../../ui/view/button"
import Modal from "@/ui/modal"
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
            setModels(data.models)
        } catch (ex) {
            console.error(ex)
        } finally {
            setRunning(false)
        }
    }, [sceneService])
    React.useEffect(() => {
        const asyncLoadScene = () => void loadScene()
        asyncLoadScene()
        sceneService.eventChange.add(asyncLoadScene)
        return () => sceneService.eventChange.remove(asyncLoadScene)
    }, [loadScene, sceneService])
    const handleDeleteModel = async (model: Model) => {
        const confirm = await Modal.confirm({
            content: (
                <div>
                    <p>You are about to delete this model:</p>
                    <ul>
                        <li>
                            <b>{model.name}</b> &nbsp; <span>#{model.id}</span>
                        </li>
                        <li>{model.loaderName}</li>
                    </ul>
                </div>
            ),
        })
        if (!confirm) return

        void sceneService.removeModel(model.id)
    }
    return (
        <div className={getClassNames(props)}>
            <Runnable running={running}>
                <header>
                    <h1>
                        Scene: {models.length} model
                        {models.length > 1 ? "s" : ""}
                    </h1>
                    <Button label="Refresh" onClick={() => void loadScene()} />
                </header>
                <div className="models-list">
                    {models.map((model) => (
                        <ModelButton
                            key={model.id}
                            model={model}
                            onDelete={(model: Model) =>
                                void handleDeleteModel(model)
                            }
                        />
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
