import * as React from "react"

import "./flex-view.css"

export interface FlexViewProps {
    className?: string
    direction?: "row" | "column" | "row-reverse" | "column-reverse"
    justifyContent?:
        | "flex-start"
        | "flex-end"
        | "center"
        | "space-around"
        | "space-between"
    alignItems?: "flex-start" | "flex-end" | "center"
    gap?: string
    children: React.ReactNode
}

export default function FlexView(props: FlexViewProps) {
    return (
        <div
            className={getClassNames(props)}
            style={{
                flexDirection: props.direction ?? "row",
                justifyContent: props.justifyContent ?? "space-around",
                alignItems: props.alignItems ?? "center",
                gap: props.gap ?? ".5em",
            }}
        >
            {props.children}
        </div>
    )
}

function getClassNames(props: FlexViewProps): string {
    const classNames = ["custom", "ui-view-FlexView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}
