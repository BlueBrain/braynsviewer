import EntryPointsServiceInterface, {
    EntryPointSchema,
} from "@/contract/service/entry-points"
import Modal from "@/ui/modal"
import Expand from "@/ui/view/expand"
import JSON5 from "json5"
import * as React from "react"
import "./documentation-view.css"
import ParamsDocumentation from "./params/params-documentation"

export interface DocumentationViewProps {
    className?: string
    service: EntryPointsServiceInterface
    entryPointName: string
}

export default function DocumentationView(props: DocumentationViewProps) {
    const { service, entryPointName } = props
    const [schema, setSchema] = React.useState<null | EntryPointSchema>(null)
    const [expanded, setExpanded] = React.useState(false)
    useEntryPointSchema(entryPointName, setSchema, service)
    return (
        <div className={getClassNames(props)}>
            {schema && (
                <>
                    <h2>Description</h2>
                    <p>{schema.description}</p>
                    {schema.spawnAsyncTask && (
                        <em>
                            This entry point spawns an asynchronous process!
                        </em>
                    )}
                    <h2>Input</h2>
                    <ParamsDocumentation params={schema.params} />
                    <h2>Output</h2>
                    <ParamsDocumentation params={schema.result} />
                    <Expand
                        className="technical-view theme-color-section"
                        label="Schema in JSON format"
                        value={expanded}
                        onChange={setExpanded}
                    >
                        <pre>{JSON5.stringify(schema.params, null, "  ")}</pre>
                        <pre>{JSON5.stringify(schema.result, null, "  ")}</pre>
                    </Expand>
                </>
            )}
        </div>
    )
}

function useEntryPointSchema(
    entryPointName: string,
    setSchema: React.Dispatch<React.SetStateAction<EntryPointSchema | null>>,
    service: EntryPointsServiceInterface
) {
    React.useEffect(() => {
        if (!entryPointName) return
        const asyncFunction = async () => {
            try {
                setSchema(await service.getEntryPointSchema(entryPointName))
            } catch (ex) {
                console.error(ex)
                void Modal.error(
                    <div>
                        <b>
                            Unable to get schema for entry point{" "}
                            <code>{entryPointName}</code>
                        </b>
                        <pre>{`${ex}`}</pre>
                    </div>
                )
            }
        }
        void asyncFunction()
    }, [service, entryPointName, setSchema])
}

function getClassNames(props: DocumentationViewProps): string {
    const classNames = ["custom", "view-entryPoints-detail-DocumentationView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}
