import * as React from "react"

import "./model-button-view.css"

interface Model {
    id: number
    name: string
    path: string
}

export interface ModelButtonViewProps {
    className?: string
    model: Model
}

export default function ModelButtonView(props: ModelButtonViewProps) {
    const { model } = props
    return (
        <button className={getClassNames(props)}>
            <div>
                <div>{model.name}</div>
                <div>{model.id}</div>
            </div>
            <div title={model.path}>{model.path}</div>
        </button>
    )
}

function getClassNames(props: ModelButtonViewProps): string {
    const classNames = ["custom", "view-scene-ModelButtonView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}
