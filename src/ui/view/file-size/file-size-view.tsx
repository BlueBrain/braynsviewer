import * as React from "react"

import "./file-size-view.css"

export interface FileSizeViewProps {
    className?: string
    /**
     * Size in bytes.
     */
    value: number
}

/**
 * Human friendly size label.  
 * It displays the unit Kb, Mb, Gb and Tb with different colors.
 */
export default function FileSizeView(props: FileSizeViewProps) {
    return (
        <div className={getClassNames(props)}>
            {getHumanReadableSize(props.value)}
        </div>
    )
}

function getClassNames(props: FileSizeViewProps): string {
    const classNames = ["custom", "ui-view-FileSizeView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}

function getHumanReadableSize(size: number, unit: string = ""): JSX.Element {
    if (unit.length > 0) {
        return (
            <span
                className={unit.toLowerCase()}
            >{`${size} ${unit}`}</span>
        )
    }

    if (size < 1024)
        return getHumanReadableSize(Math.floor(size * 1000) * 0.001, "Kb")
    size = Math.floor(size / 1024)
    if (size < 1024) return getHumanReadableSize(size, "Kb")
    size = Math.floor(size / 1024)
    if (size < 1024) return getHumanReadableSize(size, "Mb")
    size = Math.floor(size / 1024)
    if (size < 1024) return getHumanReadableSize(size, "Gb")
    size = Math.floor(size / 1024)
    return getHumanReadableSize(size, "Tb")
}
