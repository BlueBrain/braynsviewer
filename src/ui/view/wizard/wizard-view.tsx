import * as React from "react"

import "./wizard-view.css"

export interface WizardViewProps {
    className?: string
    // Key of the step to display.
    step: string
    children: JSX.Element[]
}

export default function WizardView(props: WizardViewProps) {
    const { children, step } = props
    const stepIndex = Math.max(
        0,
        children.findIndex(child => child.key === step)
    )
    return (
        <div className={getClassNames(props)}>
            {children.map((child, index) => (
                <div key={index} className={getChildClassNames(stepIndex, index)}>
                    {child}
                </div>
            ))}
        </div>
    )
}

function getClassNames(props: WizardViewProps): string {
    const classNames = ["custom", "ui-view-WizardView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}

function getChildClassNames(step: number, index: number): string | undefined {
    if (step > index) return "left"
    if (step < index) return "right"
    return ""
}
