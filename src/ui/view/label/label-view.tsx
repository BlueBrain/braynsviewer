import * as React from "react"
import "./label-view.css"

export interface LabelViewProps {
    className?: string
    target?: string
    value?: string
    /** If true, display the label in error color. */
    error?: boolean
    visible?: boolean
}

/**
 * @param props.value Text to display. If undefined, view is null.
 * @param props.target ID of the element to link this label to.
 */
export default function LabelView(props: LabelViewProps) {
    const { value, target } = props
    if (typeof value === "undefined") return null

    return (
        <label htmlFor={target} className={getClassNames(props)}>
            {value}
        </label>
    )
}

function getClassNames(props: LabelViewProps): string {
    const classNames = ["custom", "ui-view-LabelView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }
    if (props.error === true) classNames.push("error")
    if (props.visible === false) classNames.push("hide")

    return classNames.join(" ")
}
