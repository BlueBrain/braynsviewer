import * as React from "react"
import Label from "../../label"
import "./text-view.css"

const ID = "ui-view-input-TextView"

export interface TextViewProps {
    className?: string
    value: string
    label?: string
    placeholder?: string
    name?: string
    /** If defined, an error is displayed instead of the label. */
    error?: string
    /** List of suggestions for autocompletion. */
    suggestions?: string[]
    type?: "text" | "password" | "email" | "search" | "tel" | "url" | "number"
    size?: number
    enabled?: boolean
    wide?: boolean
    width?: string
    /** Set autofocus. */
    focus?: boolean
    /** A function or RegExp to validate the entry. */
    validator?: RegExp | ((value: string) => boolean)
    /** This is triggered only if the entry is valid. */
    onChange?(this: void, value: string): void
    /** Is the current entry valid? */
    onValidation?(this: void, isValid: boolean): void
    /** Triggered whn the user pressed the ENTER key. */
    onEnterPressed?(this: void, value: string): void
}

let globalId = 1

function nextId() {
    return `${ID}-${globalId++}`
}

export default function TextView(props: TextViewProps) {
    const {
        name,
        value,
        label,
        error,
        size,
        type,
        focus,
        width,
        enabled,
        placeholder,
        validator,
        suggestions,
        onChange,
        onValidation,
        onEnterPressed,
    } = props
    const ref = React.useRef<null | HTMLInputElement>(null)
    const [id, setId] = React.useState("")
    const [text, setText] = React.useState(value)
    const [valid, setValid] = React.useState(isValid(value))
    const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const newText = evt.target.value
        const validity = isValid(newText, validator)
        if (onValidation) onValidation(validity)
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
    React.useEffect(
        () => () => {
            if (ref.current) {
                if (focus) window.setTimeout(() => ref.current?.focus())
                else window.setTimeout(() => ref.current?.blur())
            }
        },
        [focus, ref]
    )
    React.useEffect(() => {
        setText(value)
    }, [value])
    const listId = `${id}:datalist`
    return (
        <div className={getClassNames(props, valid)}>
            <Label
                value={error ?? label}
                target={id}
                error={error ? true : false}
            />
            {suggestions && (
                <datalist id={listId}>
                    {suggestions.map((suggestion) => (
                        <option key={suggestion} value={suggestion} />
                    ))}
                </datalist>
            )}
            <input
                id={id}
                ref={ref}
                name={name}
                size={size}
                list={listId}
                value={text}
                type={type}
                style={{ width: width ?? "auto" }}
                placeholder={placeholder}
                disabled={enabled === false ? true : undefined}
                onChange={handleChange}
                onKeyDownCapture={handleKeyDown}
            />
            <Label className="hide" value={label} target={id} />
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
function isValid(
    value: string,
    validator?: RegExp | ((v: string) => boolean)
): boolean {
    if (!validator) return true
    if (typeof validator === `function`) {
        try {
            return validator(value)
        } catch (ex) {
            return false
        }
    }
    validator.lastIndex = -1
    return validator.test(value)
}
