import * as React from "react"
import Button from "../button"
import { ColorName } from "../types"
import "./dialog-view.css"

export interface DialogViewProps {
    className?: string
    /** If a `title` is defined, a dark primary header will be displayed. */
    title?: string
    /** If `false`, __OK__ button will be disabled. */
    valid?: boolean
    /** Use flat button for cancel, or if there is only one button. */
    flat?: boolean
    children: JSX.Element | JSX.Element[] | string
    /**
     * Passed to the __OK__ button. Usually, accented buttons
     * will change the application functional state.
     */
    colorOK?: ColorName
    /** Triggered when __OK__ button has been clicked */
    onOK?(this: void): void
    /** Triggered when __Cancel__ button has been clicked */
    onCancel?(this: void): void
    /** If `true` don't display any __Cancel__ button. */
    hideCancel?: boolean
    /** Rename the __OK__ button. */
    labelOK?: string
    /** Rename the __Cancel__ button. */
    labelCancel?: string
}

export default function DialogView(props: DialogViewProps) {
    const {
        colorOK,
        flat,
        title,
        valid,
        children,
        hideCancel,
        labelOK,
        labelCancel,
        onOK,
        onCancel,
    } = props

    return (
        <div className={getClassNames(props)}>
            {title && <header>{title}</header>}
            <div>{children}</div>
            <footer>
                {!(hideCancel ?? false) && (
                    <Button
                        label={labelCancel ?? "Cancel"}
                        onClick={onCancel}
                        flat={true}
                    />
                )}
                <Button
                    color={colorOK}
                    enabled={valid ?? true}
                    label={labelOK ?? "OK"}
                    onClick={onOK}
                    flat={hideCancel && flat}
                />
            </footer>
        </div>
    )
}

function getClassNames(props: DialogViewProps): string {
    const classNames = ["custom", "ui-view-DialogView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}
