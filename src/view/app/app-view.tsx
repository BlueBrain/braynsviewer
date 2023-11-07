import BraynsServiceInterface from "@/contract/service/brayns"
import EntryPointsServiceInterface from "@/contract/service/entry-points"
import Stack from "@/ui/view/stack"
import * as React from "react"
import EntryPointsView from "../entry-points"
import PythonScriptingView from "../python-scripting"
import AppMenu from "./app-menu"

import "./app-view.css"
import CodeFactory from "../code-factory/code-factory"

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
                    <CodeFactory key="factory" service={entryPointsService} />
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
