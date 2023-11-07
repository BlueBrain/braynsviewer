import * as React from "react"
import Options from "@/ui/view/options"
import "./app-menu-view.css"

type Page = string

export interface AppMenuViewProps {
    className?: string
    value: Page
    onChange(this: void, page: Page): void
}

const OPTIONS = {
    entryPoints: "API",
    factory: "Factory",
    python: "Python",
}

export default function AppMenuView(props: AppMenuViewProps) {
    const { value, onChange } = props
    return (
        <div className={getClassNames(props)}>
            <Options options={OPTIONS} value={value} onClick={onChange} />
        </div>
    )
}

function getClassNames(props: AppMenuViewProps): string {
    const classNames = ["custom", "view-app-AppMenuView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}
