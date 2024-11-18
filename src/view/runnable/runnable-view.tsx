import * as React from "react"
import IconFactory from "../../ui/factory/icon"
import "./runnable-view.css"

export interface RunnableViewProps {
    className?: string
    running: boolean
    children: React.ReactNode
}

/**
 * Use this component around inputs you want to disable during some running refresh.
 * It can be used with forms that trigger network queries, for instance.
 * @param props.running If `true` a "refresh" animation is displayed and the content
 * is not touchable.
 */
export default function RunnableView(props: RunnableViewProps) {
    return (
        <div className={getClassNames(props)}>
            <div className="children">{props.children}</div>
            <div className="overlay">{IconFactory.make("refresh")}</div>
        </div>
    )
}

function getClassNames(props: RunnableViewProps): string {
    const classNames = ["custom", "view-RunnableView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }
    if (props.running) classNames.push("running")

    return classNames.join(" ")
}
