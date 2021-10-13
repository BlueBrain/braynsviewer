import * as React from "react"
import "./touchable-view.css"

export interface TouchableViewProps<T> {
    className?: string
    title?: string
    children: React.ReactNode
    enabled?: boolean
    tag?: T
    onClick(tag?: T): void
}

export default function TouchableView<T>(props: TouchableViewProps<T>) {
    return (
        <button
            title={props.title}
            className={getClassNames<T>(props)}
            onClick={() => props.onClick(props.tag)}
        >
            {props.children}
        </button>
    )
}

function getClassNames<T>(props: TouchableViewProps<T>): string {
    const classNames = ["custom", "ui-view-TouchableView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }
    if (props.enabled === false) classNames.push("disabled")

    return classNames.join(" ")
}
