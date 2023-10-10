import * as React from "react"
import "./surface-view.css"

export interface SurfaceViewProps {
    className?: string
    type?: "screen" | "frame" | "section" | "input"
    children: string | JSX.Element | JSX.Element[]
}

export default function SurfaceView(props: SurfaceViewProps) {
    return <div className={getClassNames(props)}>{props.children}</div>
}

function getClassNames(props: SurfaceViewProps): string {
    const classNames = ["custom", "ui-view-SurfaceView", props.type ?? "frame"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}
