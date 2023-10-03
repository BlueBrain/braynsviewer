import { useDebouncedEffect } from "@/ui/hook"
import Label from "@/ui/view/label"
import JSON5 from "json5"
import * as React from "react"
import Editor from "react-simple-code-editor"
import { highlightJSON5 } from "./highlighter"
import "./json-editor-view.css"

export interface JsonEditorViewProps {
    className?: string
    label?: string
    value: string
    onChange(this: void, value: string): void
    onValid?(this: void, valid: boolean): void
}

export default function JsonEditorView(props: JsonEditorViewProps) {
    const { label, onChange, onValid } = props
    const [value, setValue] = React.useState(props.value)
    React.useEffect(
        () => {
            if (JSON.stringify(value) === JSON.stringify(props.value)) return
            setValue(props.value)
        },
        // We want this to trigger only when `props.value` changes,
        // but not anytime `value` changes.
        [props.value]
    )
    const [valid, setValid] = React.useState(true)
    useDebouncedEffect(
        () => {
            if (isValid(value)) {
                setValid(true)
                onChange(value)
            } else {
                setValid(false)
            }
        },
        300,
        [value, onChange]
    )
    React.useEffect(() => setValid(false), [value])
    React.useEffect(() => onValid && onValid(valid), [valid, onValid])
    return (
        <div className={getClassNames(props, valid)}>
            <Label value={label} />
            <Editor
                className="editor"
                value={value}
                highlight={highlightJSON5}
                spellCheck={false}
                onValueChange={setValue}
                padding=".5em"
            />
        </div>
    )
}

function getClassNames(props: JsonEditorViewProps, valid: boolean): string {
    const classNames = ["custom", "view-JsonEditorView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }
    if (!valid) classNames.push("invalid")

    return classNames.join(" ")
}

/**
 * Check if `text` is a valid JSON5 string.
 */
function isValid(text: string): boolean {
    if (text.trim().length === 0) return true

    try {
        JSON5.parse(text)
        return true
    } catch (ex) {
        return false
    }
}
