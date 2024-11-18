import * as React from "react"
import IconFactory from "../../factory/icon"
import "./icon-view.css"

export interface IconViewProps {
    className?: string
    name: string
    /** Default to 1.5rem. */
    size?: string
    /** If true, the icon will rotate forever. */
    animate?: boolean
    onClick?(): void
}

export default function IconView(props: IconViewProps) {
    const size = props.size ?? "1.5rem"
    const handleClick = () => props.onClick && props.onClick()
    return (
        <div
            className={getClassNames(props)}
            tabIndex={0}
            onClick={handleClick}
            style={{
                width: size,
                height: size,
            }}
        >
            {IconFactory.make(props.name)}
        </div>
    )
}

function getClassNames(props: IconViewProps): string {
    const classNames = ["custom", "ui-view-IconView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }
    if (props.animate === true) classNames.push("animate")
    if (props.onClick) classNames.push("clickable")
    return classNames.join(" ")
}
