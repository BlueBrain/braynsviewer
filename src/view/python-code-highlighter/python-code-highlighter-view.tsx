import * as React from "react"
import Highlighter from "react-syntax-highlighter"
import "./python-code-highlighter-view.css"

export interface PythonCodeHighlighterViewProps {
    className?: string
    code: string
    language?: string
}

export default function PythonCodeHighlighterView(
    props: PythonCodeHighlighterViewProps
) {
    return (
        <div className={getClassNames(props)}>
            <Highlighter language={props.language ?? "python"}>
                {props.code}
            </Highlighter>
        </div>
    )
}

function getClassNames(props: PythonCodeHighlighterViewProps): string {
    const classNames = ["custom", "view-PythonCodeHighlighterView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}
