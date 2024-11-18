import * as React from "react"
import {
    SpontaneousUpdateItem,
    SpontaneousUpdateItemValue,
} from "../../../contract/service/spontaneous-updates"
import Modal from "../../../ui/modal"
import Dialog from "../../../ui/view/dialog"

import "./update-button-view.css"

export interface UpdateButtonViewProps {
    className?: string
    item: SpontaneousUpdateItem
}

export default function UpdateButtonView(props: UpdateButtonViewProps) {
    const { item } = props
    const [expanded, setExpanded] = React.useState(false)
    const [firstValue] = item.values

    return (
        <div className={getClassNames(props, expanded)}>
            <button onClick={() => setExpanded(!expanded)}>
                <div>{item.name}</div>
                {firstValue && <div>{formatTime(firstValue.timestamp)}</div>}
            </button>
            {expanded && (
                <div className="details">
                    {item.values.map((data) => (
                        <button
                            key={data.timestamp}
                            onClick={() => showDetails(item.name, data)}
                        >
                            <div>{formatTime(data.timestamp)}</div>
                            <code>{JSON.stringify(data.value)}</code>
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

function getClassNames(
    props: UpdateButtonViewProps,
    expanded: boolean
): string {
    const classNames = ["custom", "view-spontaneousUpdates-UpdateButtonView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }
    if (expanded) classNames.push("expanded")

    return classNames.join(" ")
}

function formatTime(timestamp: number): string {
    const d = new Date(timestamp)
    const hh = d.getHours()
    const mm = pad(d.getMinutes())
    const ss = pad(d.getSeconds())
    return `${hh}:${mm}:${ss}`
}

function pad(value: number): string {
    let text = `${value}`
    while (text.length < 2) text = `0${text}`
    return text
}

function showDetails(name: string, data: SpontaneousUpdateItemValue): void {
    const modal = new Modal()
    modal.show(
        <Dialog
            title={`${name}  (${formatTime(data.timestamp)})`}
            hideCancel={true}
            labelOK="Close"
            onOK={modal.hide}
        >
            <pre>{JSON.stringify(data.value, null, "  ")}</pre>
        </Dialog>
    )
}
