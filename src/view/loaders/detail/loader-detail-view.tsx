import LoadersServiceInterface, {
    AddModelParams,
    LoaderDefinition,
} from "@/contract/service/loaders"
import { assertObject, isObject } from "@/tool/type-check"
import { useLocalStorageState } from "@/ui/hook"
import Modal from "@/ui/modal"
import Button from "@/ui/view/button"
import Expand from "@/ui/view/expand"
import FloatingButton from "@/ui/view/floating-button"
import Input from "@/ui/view/input/text"
import Runnable from "@/view/runnable"
import * as React from "react"
import Field from "./field"
import { useLoaderValues } from "./hooks"
import "./loader-detail-view.css"

export interface LoaderDetailViewProps {
    className?: string
    loader?: LoaderDefinition
    loadersService: LoadersServiceInterface
    onBack(this: void): void
}

export default function LoaderDetailView(props: LoaderDetailViewProps) {
    const { loader, onBack, loadersService } = props
    const [busy, setBusy] = React.useState(false)
    const [error, setError] = React.useState("")
    const [result, setResult] = React.useState("")
    const [showError, setExpandError] = React.useState(true)
    const [showResult, setExpandResult] = React.useState(true)
    const [filename, setFilename] = useLocalStorageState(
        "",
        `LoadersDetailView/${props.loader?.name}`
    )
    const [values, setValues] = useLoaderValues(loader)
    const addModelParams = makeAddModelParams(
        loader?.name ?? "",
        filename,
        values
    )
    const handleExportCode = () =>
        Modal.info(<pre>{prettify(addModelParams)}</pre>)
    const handleExecute = makeExecute(
        addModelParams,
        setBusy,
        setError,
        setExpandError,
        setResult,
        setExpandResult,
        loadersService
    )
    return (
        <Runnable className={getClassNames(props)} running={busy}>
            <div>
                {loader && (
                    <>
                        <header>
                            <FloatingButton
                                icon="arrow-left"
                                onClick={onBack}
                            />
                            <h1>{loader.name}</h1>
                        </header>
                        {error && (
                            <Expand
                                label="Error"
                                value={showError}
                                onChange={setExpandError}
                            >
                                <pre className="error">{error}</pre>
                            </Expand>
                        )}
                        {result && (
                            <Expand
                                label="result"
                                value={showResult}
                                onChange={setExpandResult}
                            >
                                <pre className="result">{result}</pre>
                            </Expand>
                        )}
                        <Input
                            wide={true}
                            label="Full path of the file to load"
                            value={filename}
                            onChange={setFilename}
                        />
                        {loader.properties.map((property) => (
                            <Field
                                key={property.name}
                                property={property}
                                values={values}
                                onChange={setValues}
                            />
                        ))}
                        <div className="buttons">
                            <Button
                                icon="python"
                                label="Export Code"
                                onClick={() => void handleExportCode()}
                            />
                            <Button
                                icon="play"
                                label="Execute Loader"
                                color="accent"
                                onClick={() => void handleExecute()}
                            />
                        </div>
                        <div className="extensions">
                            <b>Extensions:</b>
                            <br />
                            <span>{loader.extensions.join(", ")}</span>
                        </div>
                    </>
                )}
            </div>
        </Runnable>
    )
}

function getClassNames(props: LoaderDetailViewProps): string {
    const classNames = ["custom", "view-loaders-LoaderDetailView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}

interface Values {
    [key: string]: unknown
}

function makeAddModelParams(
    name: string,
    filename: string,
    values: Values
): AddModelParams {
    const data: AddModelParams = {
        loader_name: name,
        path: filename,
        loader_properties: values,
        bounding_box: false,
        visible: true,
        transformation: {
            rotation: [0, 0, 0, 1],
            rotation_center: [0, 0, 0],
            scale: [1, 1, 1],
            translation: [0, 0, 0],
        },
    }
    return data
}

function prettify(dic: unknown, indent: string = ""): string {
    if (!isObject(dic)) {
        return JSON.stringify(dic)
    }

    return `{
${indent}    ${Object.keys(dic)
        .map((key) => {
            const val = dic[key]
            if (isObject(val)) return prettify(val, `${indent}    `)

            return JSON.stringify(val)
        })
        .join(`,\n    ${indent}`)}
${indent}}`
}

function makeExecute(
    addModelParams: AddModelParams,
    setBusy: React.Dispatch<React.SetStateAction<boolean>>,
    setError: React.Dispatch<React.SetStateAction<string>>,
    setExpandError: React.Dispatch<React.SetStateAction<boolean>>,
    setResult: React.Dispatch<React.SetStateAction<string>>,
    setExpandResult: React.Dispatch<React.SetStateAction<boolean>>,
    loadersService: LoadersServiceInterface
) {
    return async () => {
        setBusy(true)
        setError("")
        setExpandError(false)
        setResult("")
        setExpandResult(false)
        try {
            const result = await loadersService.addModel(addModelParams)
            assertObject(result)
            setResult(prettify(result))
            setExpandResult(true)
        } catch (ex) {
            if (isObject(ex)) {
                setError(prettify(ex))
            } else {
                setError(JSON.stringify(ex))
            }
            setExpandError(true)
        } finally {
            setBusy(false)
        }
    }
}
