import * as React from "react"
import AppMenu from "./app-menu"
import BraynsServiceInterface from "@/contract/service/brayns"
import CameraServiceInterface from "@/contract/service/camera"
import CameraView from "../camera"
import EntryPointsServiceInterface from "@/contract/service/entry-points"
import EntryPointsView from "../entry-points"
import FileSize from "@/ui/view/file-size"
import FloatingButton from "@/ui/view/floating-button"
import InfoServiceInterface from "@/contract/service/info"
import LoadersServiceInterface from "@/contract/service/loaders"
import LoadersView from "../loaders"
import PythonScriptingView from "../python-scripting"
import RendererServiceInterface from "@/contract/service/renderer"
import RendererView from "../renderer"
import SceneServiceInterface from "@/contract/service/scene"
import SceneView from "../scene"
import SceneViewManagerInterface from "@/contract/manager/scene-view-manager"
import SpontaneousUpdatesServiceInterface from "@/contract/service/spontaneous-updates"
import SpontaneousUpdatesView from "../spontaneous-updates"
import Stack from "@/ui/view/stack"
import { useScreenLock, useStatistics } from "./hooks"
import "./app-view.css"

export interface AppViewProps {
    className?: string
    // Brayns address.
    address: { host: string; port: number }
    braynsService: BraynsServiceInterface
    entryPointsService: EntryPointsServiceInterface
}

export default function AppView(props: AppViewProps) {
    const { address, braynsService, entryPointsService } = props
    const [page, setPage] = React.useState("entryPoints")
    return (
        <div className={getClassNames(props)}>
            <header className="theme-color-primary-dark theme-shadow-header">
                <AppMenu className="menu" value={page} onChange={setPage} />
                {/* <div>
                    <a
                        href="https://brayns.readthedocs.io/en/latest/"
                        target="_doc_"
                    >
                        Brayns Documentation
                    </a>
                </div> */}
                <div>
                    <a href="./doc/" target="_doc_">
                        Brayns Documentation
                    </a>
                </div>
                <div>
                    {address.host}
                    <span className="port">:{address.port}</span>
                </div>
            </header>
            <menu className="theme-color-screen">
                <Stack className="fullheight" value={page} animation="none">
                    <EntryPointsView
                        key="entryPoints"
                        service={entryPointsService}
                    />
                    <PythonScriptingView key="python" brayns={braynsService} />
                </Stack>
            </menu>
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
