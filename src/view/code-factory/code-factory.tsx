import React from "react"

import EntryPointsServiceInterface from "@/contract/service/entry-points"
import { useEntryPointsHierarchy } from "@/hooks/entry-points"
import { useDebouncedEffect } from "@/ui/hook"
import Input from "@/ui/view/input/text"
import { makeCode } from "./make-code"
import PythonCodeHighlighterView from "../python-code-highlighter"
import Button from "@/ui/view/button"

import Styles from "./code-factory.module.css"

export default function CodeFactory({
    service,
}: {
    service: EntryPointsServiceInterface
}) {
    const [prefix, setPrefix] = React.useState("Renderer")
    const [code, setCode] = React.useState("")
    const entryPoints = useEntryPointsHierarchy(service)
    useDebouncedEffect(
        () => {
            if (!entryPoints) {
                setCode("// Loading...")
                return
            }
            setCode(makeCode(entryPoints, prefix))
        },
        300,
        [prefix, entryPoints]
    )
    const handleCopy = () => {
        navigator.clipboard
            .writeText(code)
            .then(() =>
                alert(`${code.length} characters copied to the clipboard.`)
            )
            .catch(console.error)
    }
    return (
        <div className={Styles.CodeFactory}>
            <header>
                <Input
                    label="Class prefix"
                    value={prefix}
                    onChange={setPrefix}
                />
                <Button
                    label={`Copy to Clipboard (${code.length} chars)`}
                    onClick={handleCopy}
                />
            </header>
            <PythonCodeHighlighterView code={code} language="ts" />
        </div>
    )
}
