import * as React from "react"
import Label from "../label"
import Touchable from "../touchable"
import "./options-view.css"

export interface OptionsViewProps {
    className?: string
    label?: string
    value: string
    options: { [key: string]: string }
    onClick(this: void, value: string): void
}

export default function OptionsView(props: OptionsViewProps) {
    const { label, value, options, onClick } = props
    return (
        <div className={getClassNames(props)}>
            <Label value={label} />
            <div className="options theme-shadow-button">
                {Object.keys(options).map((key) =>
                    key === value ? (
                        <div className="button theme-color-primary" key={key}>
                            {options[key]}
                        </div>
                    ) : (
                        <Touchable
                            className="button theme-color-section"
                            key={key}
                            onClick={() => onClick(key)}
                        >
                            {options[key]}
                        </Touchable>
                    )
                )}
            </div>
        </div>
    )
}

function getClassNames(props: OptionsViewProps): string {
    const classNames = ["custom", "ui-view-OptionsView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}
