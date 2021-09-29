import * as React from "react"
import Label from "../../label"
import "./text-view.css"

const ID = "ui-view-input-TextView"

export interface TextViewProps {
    className?: string
    value: string
    label?: string
    size?: number
    enabled?: boolean
    wide?: boolean
    validator?: RegExp | ((value: string) => boolean)
    onChange?(value: string): void
    onEnterPressed?(value: string): void
}

let globalId = 1

function nextId() {
    return `${ID}-${globalId++}`
}

export default function TextView(props: TextViewProps) {
    const { value, label, size, enabled, validator, onChange, onEnterPressed } = props
    const [id, setId] = React.useState("")
    const [text, setText] = React.useState(value)
    const [valid, setValid] = React.useState(isValid(value))

    const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const newText = evt.target.value
        const validity = isValid(newText, validator)
        setValid(validity)
        setText(newText)
        if (!validity || typeof onChange !== "function") return

        onChange(newText)
    }
    const handleKeyDown = (evt: React.KeyboardEvent<HTMLInputElement>) => {
        if (!valid) return
        if (typeof onEnterPressed !== "function") return
        if (evt.key === "Enter") onEnterPressed(text)
    }

    React.useEffect(() => setId(nextId()), [])
    React.useEffect(() => {
        setText(value)
    }, [value])

    return (
        <div className={getClassNames(props, valid)}>
            <Label value={label} target={id} />
            <input
                id={id}
                size={size}
                value={text}
                disabled={enabled === false ? true : undefined}
                onChange={handleChange}
                onKeyDownCapture={handleKeyDown}
            />
        </div>
    )
}

function getClassNames(props: TextViewProps, valid: boolean): string {
    const classNames = ["custom", ID]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }
    if (props.wide === true) classNames.push("wide")
    if (valid === false) classNames.push("invalid")

    return classNames.join(" ")
}

/**
 * Use a validator to check value's validity.
 */
function isValid(value: string, validator?: RegExp|((v: string)=>boolean)): boolean {
    if (!validator) return true
    if (typeof validator===`function`) {
        try {
            return validator(value)
        } catch(ex) {
            return false
        }
    }
    validator.lastIndex =-1
    return validator.test(value)
}