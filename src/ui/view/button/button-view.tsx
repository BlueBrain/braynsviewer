import * as React from "react"
import IconFactory from "../../factory/icon"
import FloatingButton from "../floating-button"
import Label from "../label"
import { ColorName } from "../types"
import "./button-view.css"

export interface ButtonViewProps<Tag> {
    className?: string
    label?: string
    /**
     * If defined, an icon is added (default to the left).
     * The icon's name is used in `icon-factory`.
     */
    icon?: string
    /** Flat buttons do not have any background. */
    flat?: boolean
    /** Color. Default to "primary". */
    color?: ColorName
    /** Default `false`. If `true`, spread to the whole width. */
    wide?: boolean
    /** If defined, an error message is displayed above the button. */
    error?: string
    outline?: boolean
    enabled?: boolean
    /** If true, the icon is on the right. */
    reversed?: boolean
    visible?: boolean
    tag?: Tag
    onClick?(tag?: Tag): void
}

/**
 * @param props.label Text to display.
 * @param props.enabled Default `true`.
 * @param props.accent If `true` this is an accented button (with secondary color).
 * @param props.tag Any data you set as a tag will be triggered in `onClick(tag)` function.
 */
export default function ButtonView<Tag>(props: ButtonViewProps<Tag>) {
    const { label, icon, error, tag, onClick } = props
    const handleClick = () => {
        if (typeof onClick !== "function") return

        onClick(tag)
    }
    if (props.visible === false) return null

    if (!label)
        return (
            <FloatingButton
                enabled={props.enabled}
                tag={tag}
                icon={icon ?? "ok"}
                className={getClassNames(props)}
                onClick={handleClick}
                color={props.color}
            />
        )

    return (
        <div className={getClassNames(props)}>
            {error && <Label className="error" error={true} value={error} />}
            <button
                className={`theme-color-${props.color ?? "primary"}`}
                onClick={handleClick}
            >
                {icon && IconFactory.make(icon)}
                <div className="label">{label}</div>
            </button>
        </div>
    )
}

function getClassNames<Tag>(props: ButtonViewProps<Tag>): string {
    const { className, enabled, reversed, outline, wide, flat, icon } =
        props
    const classNames = ["custom", "ui-view-ButtonView"]
    if (typeof className === "string") {
        classNames.push(className)
    }
    if (enabled === false) classNames.push("disabled")
    if (wide === true) classNames.push("wide")
    if (flat === true) classNames.push("flat")
    if (outline === true) classNames.push("outline")
    if (icon) classNames.push("with-icon")
    if (reversed === true) classNames.push("flip")
    return classNames.join(" ")
}
