import * as React from "react"
import FloatingButton from "@/ui/view/floating-button"
import "./model-button-view.css"

export interface Model {
    id: number
    name: string
    path: string
}

export interface ModelButtonViewProps {
    className?: string
    model: Model
    onDelete(this: void, model: Model): void
}

export default function ModelButtonView(props: ModelButtonViewProps) {
    const { model } = props
    return (
        <div className={getClassNames(props)}>
            <button className="model">
                <div>
                    <div>{model.name}</div>
                    <div>{model.id}</div>
                </div>
                <div title={model.path}>{model.path}</div>
            </button>
            <FloatingButton
                small={true}
                color="accent"
                icon="delete"
                onClick={() => props.onDelete(model)}
            />
        </div>
    )
}

function getClassNames(props: ModelButtonViewProps): string {
    const classNames = ["custom", "view-scene-ModelButtonView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}
