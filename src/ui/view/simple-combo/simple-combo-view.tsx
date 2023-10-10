import * as React from "react"
import Label from "../label"
import "./simple-combo-view.css"

const ID = "ui-view-SimpleComboView"

export interface SimpleComboViewProps {
    className?: string
    value: string
    values: string[]
    label?: string
    name?: string
    enabled?: boolean
    wide?: boolean
    width?: string
    onChange(this: void, value: string): void
    /** Triggered when the user pressed the ENTER key. */
    onEnterPressed?(this: void, value: string): void
}

let globalId = 1

function nextId() {
    return `${ID}-${globalId++}`
}

export default function SimpleComboView(props: SimpleComboViewProps) {
    const {
        name,
        value,
        values,
        label,
        width,
        enabled,
        onChange,
        onEnterPressed,
    } = props
    const refId = React.useRef<string>(nextId())
    const handleChange = makeHandleChange(onChange)
    const handleKeyDown = (evt: React.KeyboardEvent<HTMLSelectElement>) => {
        if (typeof onEnterPressed !== "function") return
        if (evt.key === "Enter") onEnterPressed(value)
    }
    return (
        <div className={getClassNames(props)}>
            <Label value={label} target={refId.current} />
            <div style={{ width: width ?? "auto" }}>
                <select
                    id={refId.current}
                    name={name}
                    value={value}
                    disabled={enabled === false ? true : undefined}
                    onChange={handleChange}
                    onKeyDownCapture={handleKeyDown}
                >
                    {values.map((v) => (
                        <option key={v} value={v}>
                            {v}
                        </option>
                    ))}
                </select>
                <div className="button">▼</div>
            </div>
            <Label className="hide" value={label} />
        </div>
    )
}

function makeHandleChange(
    onChange: (value: string) => void
): (evt: React.ChangeEvent<HTMLSelectElement>) => void {
    return (evt: React.ChangeEvent<HTMLSelectElement>) =>
        onChange(evt.target.value)
}

function getClassNames(props: SimpleComboViewProps): string {
    const classNames = ["custom", ID]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }
    if (props.wide === true) classNames.push("wide")

    return classNames.join(" ")
}
