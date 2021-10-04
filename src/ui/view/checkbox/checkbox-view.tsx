import * as React from "react"

import "./checkbox-view.css"

export interface CheckboxViewProps {
    className?: string
    value: boolean
    label?: string
    enabled?: boolean
    wide?: boolean
    reverse?: boolean
    onChange(value: boolean): void
}

export default function CheckboxView(props: CheckboxViewProps) {
    const { value, label, enabled, onChange } = props
    return (
        <button
            className={getClassNames(props)}
            disabled={enabled === false ? true : undefined}
            onClick={() => onChange(!value)}
        >
            <div className="pin">
                <div className="bar"> </div>
                <div className="btn"> </div>
            </div>
            <div className="label">{label}</div>
        </button>
    )
}

function getClassNames(props: CheckboxViewProps): string {
    const { className, value, enabled, wide, reverse } = props
    const classNames = ["custom", "ui-view-CheckboxView"]
    if (typeof className === "string") {
        classNames.push(className)
    }
    if (value === true) classNames.push("ok")
    if (enabled === false) classNames.push("disabled")
    if (wide === true) classNames.push("wide")
    if (reverse === true) classNames.push("reverse")
    return classNames.join(" ")
}
