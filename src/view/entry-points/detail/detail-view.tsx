import * as React from "react"
import EntryPointsServiceInterface from "../../../contract/service/entry-points"
import { useLocalStorageState } from "../../../ui/hook/local-storage-state"
import Button from "../../../ui/view/button"
import FloatingButton from "../../../ui/view/floating-button"
import JsonEditorView from "../../json-editor/json-editor-view"
import "./detail-view.css"
import DocumentationView from "./documentation/documentation-view"

export interface DetailViewProps {
    className?: string
    entryPointName: string
    service: EntryPointsServiceInterface
    onBack(): void
}

export default function DetailView(props: DetailViewProps) {
    const { entryPointName, service, onBack } = props
    const [params, setParams] = useLocalStorageState(
        "{}",
        `entry-point/${entryPointName}/params`
    )
    return (
        <div className={getClassNames(props)}>
            <header>
                <FloatingButton icon="arrow-left" onClick={onBack} />
                <h1>{entryPointName}</h1>
            </header>
            <JsonEditorView
                label="Parameters"
                value={params}
                onChange={setParams}
            />
            <Button label="Execute" icon="play" color="accent"/>
            <DocumentationView
                service={service}
                entryPointName={entryPointName}
            />
            <p> <b>?</b>: Optional field.</p>
        </div>
    )
}

function getClassNames(props: DetailViewProps): string {
    const classNames = ["custom", "view-entryPoints-DetailView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}
