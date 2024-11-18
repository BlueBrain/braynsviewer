import JSON5 from "json5"
import * as React from "react"
import EntryPointsServiceInterface from "../../../contract/service/entry-points"
import { useLocalStorageState } from "../../../ui/hook/local-storage-state"
import Button from "../../../ui/view/button"
import Expand from "../../../ui/view/expand"
import JsonEditorView from "../../json-editor/json-editor-view"
import RunnableView from "../../runnable/runnable-view"
import DocumentationView from "./documentation/documentation-view"

import "./detail-view.css"

export interface DetailViewProps {
    className?: string
    entryPointName: string
    service: EntryPointsServiceInterface
}

export default function DetailView(props: DetailViewProps) {
    const { entryPointName, service } = props
    const [params, setParams] = useLocalStorageState(
        "",
        `entry-point/${entryPointName}/params`
    )
    const [executing, setExecuting] = React.useState(false)
    const [result, setResult] = React.useState<null | string>(null)
    const [error, setError] = React.useState<null | string>(null)
    const [expandOutput, setExpandOutput] = React.useState(true)
    const hasAnyOutput: boolean = error !== null || result !== null
    const handleExec = makeHandleExec(
        service,
        entryPointName,
        params,
        setExecuting,
        setResult,
        setError,
        setExpandOutput
    )
    React.useEffect(() => {
        setResult(null)
        setError(null)
        setExpandOutput(false)
    }, [entryPointName])
    if (!entryPointName) return null

    return (
        <RunnableView className={getClassNames(props)} running={executing}>
            <header>
                <h1>{entryPointName}</h1>
                <Button
                    label="Execute"
                    icon="play"
                    color="accent"
                    onClick={() => void handleExec()}
                />
            </header>
            <JsonEditorView
                label="Parameters"
                value={params}
                onChange={setParams}
            />
            {hasAnyOutput && (
                <Expand label="Output" value={expandOutput}>
                    {result && <pre className="result">{result}</pre>}
                    {error && (
                        <div>
                            <b style={{ color: "var(--theme-color-error)" }}>
                                Error:
                            </b>
                            <pre className="error">{error}</pre>
                        </div>
                    )}
                </Expand>
            )}
            <DocumentationView
                service={service}
                entryPointName={entryPointName}
            />
            <p>
                {" "}
                <b>?</b>: Optional field.
            </p>
        </RunnableView>
    )
}

function getClassNames(props: DetailViewProps): string {
    const classNames = ["custom", "view-entryPoints-DetailView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}

function makeHandleExec(
    service: EntryPointsServiceInterface,
    entryPointName: string,
    params: string,
    setExecuting: React.Dispatch<React.SetStateAction<boolean>>,
    setResult: React.Dispatch<React.SetStateAction<string | null>>,
    setError: React.Dispatch<React.SetStateAction<string | null>>,
    setExpandOutput: React.Dispatch<React.SetStateAction<boolean>>
) {
    return async () => {
        setExecuting(true)
        setError(null)
        try {
            const result = await service.exec(
                entryPointName,
                params ? JSON5.parse(params) : undefined
            )
            setResult(JSON5.stringify(result, null, "  "))
        } catch (ex) {
            console.error(`Unable to exec entryPoint "${entryPointName}"!`, ex)
            setError(JSON5.stringify(ex, null, "  "))
        } finally {
            setExecuting(false)
            setExpandOutput(true)
        }
    }
}
