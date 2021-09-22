import * as React from "react"
import SceneViewManagerInterface from "../../contract/manager/scene-view-manager"
import CameraServiceInterface from "../../contract/service/camera"
import EntryPointsServiceInterface from "../../contract/service/entry-points"
import InfoServiceInterface from "../../contract/service/info"
import RendererServiceInterface from "../../contract/service/renderer"
import SceneServiceInterface from "../../contract/service/scene"
import SpontaneousUpdatesServiceInterface from "../../contract/service/spontaneous-updates"
import FileSize from "../../ui/view/file-size"
import FloatingButton from "../../ui/view/floating-button"
import Stack from "../../ui/view/stack"
import CameraView from "../camera"
import EntryPointsView from '../entry-points'
import RendererView from "../renderer"
import SceneView from "../scene"
import SpontaneousUpdatesView from "../spontaneous-updates"
import AppMenu from "./app-menu"
import "./app-view.css"
import { confirmLock, confirmUnlock } from "./lock-confirm"

export interface AppViewProps {
    className?: string
    // Brayns address.
    address: { host: string; port: number }
    sceneView: SceneViewManagerInterface
    sceneService: SceneServiceInterface
    spontaneaousUpdatesService: SpontaneousUpdatesServiceInterface
    cameraService: CameraServiceInterface
    rendererService: RendererServiceInterface
    infoService: InfoServiceInterface
    entryPointsService: EntryPointsServiceInterface
}

export default function AppView(props: AppViewProps) {
    const {
        spontaneaousUpdatesService,
        cameraService,
        rendererService,
        sceneService,
        sceneView,
        address,
        infoService,
        entryPointsService
    } = props
    const [version, setVersion] = React.useState("...")
    const [page, setPage] = React.useState("camera")
    const [fps, setFps] = React.useState(0)
    const [memory, setMemory] = React.useState(0)
    const [locked, setLocked] = React.useState(sceneView.locked)
    const handleLockClick = React.useCallback(() => {
        const later = async () => {
            console.log("🚀 [app-view] sceneView.locked = ", sceneView.locked) // @FIXME: Remove this line written on 2021-07-20 at 10:30
            if (sceneView.locked) {
                if (await confirmUnlock()) {
                    setLocked(false)
                    sceneView.locked = false
                }
            } else {
                if (await confirmLock()) {
                    setLocked(true)
                    sceneView.locked = true
                }
            }
        }
        later()
    }, [sceneView])
    React.useEffect(() => {
        const later = async () => {
            const data = await infoService.getVersion()
            setVersion(
                `${data.major}.${data.minor}.${data.patch} (${data.revision})`
            )
            const stats = await infoService.getStatistics()
            setFps(stats.framesPerSecond)
            setMemory(stats.memoryUsage)
        }
        later()
        const handleInfoUpdate = () => {
            setFps(infoService.framesPerSecond)
            setMemory(infoService.memoryUsage)
        }
        infoService.eventChange.add(handleInfoUpdate)
        return () => infoService.eventChange.remove(handleInfoUpdate)
    }, [infoService])
    return (
        <div className={getClassNames(props)}>
            <nav>
                <header className="theme-color-primary-dark theme-shadow-header">
                    <div className="flex">
                        <div>
                            {address.host}
                            <span className="port">:{address.port}</span>
                        </div>
                        <div>{version}</div>
                    </div>
                    <div className="flex">
                        <div>
                            <span className="label">Memory usage: </span>
                            <FileSize className="inline" value={memory} />
                            <span className="label">{` ${memory}`}</span>
                        </div>
                        <div>
                            <span className="label">Frames per sec.: </span>
                            <span>{Math.floor(0.5 + fps)}</span>
                        </div>
                    </div>
                    <AppMenu value={page} onChange={setPage} />
                </header>
                <menu className="theme-color-screen">
                    <Stack className="fullheight" value={page} animation="none">
                        <SceneView key="models" sceneService={sceneService} />
                        <CameraView
                            key="camera"
                            cameraService={cameraService}
                        />
                        <RendererView
                            key="renderer"
                            rendererService={rendererService}
                        />
                        <SpontaneousUpdatesView
                            key="broadcast"
                            service={spontaneaousUpdatesService}
                        />
                        <EntryPointsView
                            key="entrypoints"
                            service={entryPointsService}
                        />
                    </Stack>
                </menu>
            </nav>
            <main
                className={locked ? "locked" : ""}
                title={
                    locked
                        ? "The view is locked! Use the button on the top right to unlock it."
                        : ""
                }
            >
                {sceneView.getView()}
                <div className="icons">
                    <FloatingButton
                        icon="snapshot"
                        onClick={() => console.log("Click")}
                    />
                    <FloatingButton
                        icon={locked ? "lock-off" : "lock-on"}
                        onClick={handleLockClick}
                    />
                </div>
                <div className="gizmo">
                    {locked && (
                        <div className="lock-warning" onClick={handleLockClick}>
                            Viewport is locked!
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}

function getClassNames(props: AppViewProps): string {
    const classNames = ["custom", "view-AppView", "thm-bgP"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}
