import { LoaderDefinition } from "@/contract/service/loaders"
import Touchable from "@/ui/view/touchable"
import * as React from "react"
import "./loader-button-view.css"

export interface LoaderButtonViewProps {
    className?: string
    value: LoaderDefinition
    onClick(value: LoaderDefinition): void
}

export default function LoaderButtonView(props: LoaderButtonViewProps) {
    const name = props.value.name
    const extensions = props.value.extensions.join(", ")
    return (
        <Touchable
            className={getClassNames(props)}
            onClick={() => props.onClick(props.value)}
        >
            <div>{name}</div>
            <div title={extensions}>{extensions}</div>
        </Touchable>
    )
}

function getClassNames(props: LoaderButtonViewProps): string {
    const classNames = ["custom", "view-loaders-LoaderButtonView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}
