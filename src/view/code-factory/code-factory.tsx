import React from "react"
import Highlighter from "react-syntax-highlighter"

import EntryPointsServiceInterface from "@/contract/service/entry-points"
import { useEntryPointsHierarchy } from "@/hooks/entry-points"
import { useDebouncedEffect } from "@/ui/hook"
import Input from "@/ui/view/input/text"
import { makeCode } from "./make-code"

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
    return (
        <div>
            <Input label="Class prefix" value={prefix} onChange={setPrefix} />
            <Highlighter language="ts">{code}</Highlighter>
        </div>
    )
}
