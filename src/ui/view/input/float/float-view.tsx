import * as React from "react"
import TextInput from "../text"

import "./float-view.css"

export interface FloatViewProps {
    className?: string
    value: number
    label?: string
    size?: number
    enabled?: boolean
    wide?: boolean
    onChange?(value: number): void
    onEnterPressed?(value: number): void
}

export default function FloatView(props: FloatViewProps) {
    const { value, label, size, enabled, wide, onChange, onEnterPressed } = props
    return (
        <TextInput
            className={getClassNames(props)}
            value={`${value}`}
            label={label}
            size={size}
            enabled={enabled}
            wide={wide}
            validator={RX_FLOAT}
            onChange={value => onChange && onChange(parseFloat(value))}
            onEnterPressed={value =>
                onEnterPressed && onEnterPressed(parseFloat(value))
            }
        />
    )
}

const RX_FLOAT = /^[+-]?([.][0-9]+|[0-9]+([.][0-9]+)?)(e[+-]?[0-9]+)?$/gi

function getClassNames(props: FloatViewProps): string {
    const classNames = ["custom", "ui-view-input-FloatView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}
