import * as React from "react"
import BraynsServiceInterface from "../../contract/service/brayns"
import Button from "@/ui/view/button"
import Flex from "@/ui/view/flex"
import InputText from "@/ui/view/input/text"
import PythonCodeView from "../python-code-highlighter"
import { generatePythonCode } from "./code-generator"
import { savePythonFile } from "../../contract/tool/save-file"
import { useLocalStorageState } from "../../ui/hook"
import "./python-scripting-view.css"

export interface PythonScriptingViewProps {
    className?: string
    brayns: BraynsServiceInterface
}

const RX_FILENAME = /[^.]+\.py$/gu

export default function PythonScriptingView(props: PythonScriptingViewProps) {
    const [code, setCode] = React.useState("")
    const [filename, setFilename] = useLocalStorageState(
        "script.py",
        "view/python-scripting/FILE"
    )
    const [validFilename, setValidFilename] = React.useState<boolean>(
        isValidFilename(filename)
    )
    const handleGenerateCode = async () => {
        setCode(await generatePythonCode(props.brayns))
    }
    const handleSaveCode = () => {
        savePythonFile(code, filename)
    }
    return (
        <div className={getClassNames(props)}>
            <h1>Python Scripting</h1>
            <Flex justifyContent="space-between">
                <InputText
                    className="flex1"
                    wide={true}
                    label="Filename"
                    value={filename}
                    validator={RX_FILENAME}
                    onValidation={setValidFilename}
                    onChange={setFilename}
                />
                <Button
                    className="flex0"
                    icon="python"
                    label="Generate"
                    enabled={validFilename}
                    onClick={() => void handleGenerateCode()}
                />
                <Button
                    className="flex0"
                    icon="export"
                    label="Save"
                    enabled={code.trim().length > 0}
                    onClick={handleSaveCode}
                />
            </Flex>
            <PythonCodeView
                code={code || "# Click GENERATE and preview the code here..."}
            />
        </div>
    )
}

function getClassNames(props: PythonScriptingViewProps): string {
    const classNames = ["custom", "view-PythonScriptingView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}

function isValidFilename(filename: string) {
    RX_FILENAME.lastIndex = -1
    return RX_FILENAME.test(filename)
}
