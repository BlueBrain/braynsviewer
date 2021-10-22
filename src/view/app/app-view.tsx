import SceneViewManagerInterface from "@/contract/manager/scene-view-manager"
import CameraServiceInterface from "@/contract/service/camera"
import EntryPointsServiceInterface from "@/contract/service/entry-points"
import InfoServiceInterface from "@/contract/service/info"
import LoadersServiceInterface from "@/contract/service/loaders"
import RendererServiceInterface from "@/contract/service/renderer"
import SceneServiceInterface from "@/contract/service/scene"
import SpontaneousUpdatesServiceInterface from "@/contract/service/spontaneous-updates"
import FileSize from "@/ui/view/file-size"
import FloatingButton from "@/ui/view/floating-button"
import Stack from "@/ui/view/stack"
import * as React from "react"
import CameraView from "../camera"
import EntryPointsView from "../entry-points"
import LoadersView from "../loaders"
import RendererView from "../renderer"
import SceneView from "../scene"
import SpontaneousUpdatesView from "../spontaneous-updates"
import AppMenu from "./app-menu"
import "./app-view.css"
import { useScreenLock, useStatistics } from "./hooks"

export interface AppViewProps {
    className?: string
    // Brayns address.
    address: { host: string; port: number }
    cameraService: CameraServiceInterface
    entryPointsService: EntryPointsServiceInterface
    infoService: InfoServiceInterface
    loadersService: LoadersServiceInterface
    rendererService: RendererServiceInterface
    sceneService: SceneServiceInterface
    sceneView: SceneViewManagerInterface
    spontaneaousUpdatesService: SpontaneousUpdatesServiceInterface
}

export default function AppView(props: AppViewProps) {
    const {
        address,
        cameraService,
        entryPointsService,
        infoService,
        loadersService,
        rendererService,
        sceneService,
        sceneView,
        spontaneaousUpdatesService,
    } = props
    const [page, setPage] = React.useState("camera")
    const [fps, memory, version] = useStatistics(infoService)
    const [locked, toggleLocked] = useScreenLock(sceneView)
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
                    <AppMenu className="menu" value={page} onChange={setPage} />
                </header>
                <menu className="theme-color-screen">
                    <Stack className="fullheight" value={page} animation="none">
                        <SceneView key="models" sceneService={sceneService} />
                        <LoadersView key="loaders" loadersService={loadersService}/>
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
                            key="entryPoints"
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
                        onClick={toggleLocked}
                    />
                </div>
                <div className="gizmo">
                    {locked && (
                        <div className="lock-warning" onClick={toggleLocked}>
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
