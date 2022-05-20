import * as React from "react"
import Touchable from "../../../ui/view/touchable"
import "./app-menu-view.css"

type Page = string

export interface AppMenuViewProps {
    className?: string
    value: Page
    onChange(page: Page): void
}

const MENU_ITEMS: Array<[key: string, label: string]> = [
    ["models", "Models"],
    ["loaders", "Loaders"],
    ["camera", "Camera"],
    ["renderer", "Renderer"],
    ["entryPoints", "API"],
    ["broadcast", "Events"],
    ["python", "Python"],
]

export default function AppMenuView(props: AppMenuViewProps) {
    const { value, onChange } = props
    return (
        <div className={getClassNames(props)}>
            {MENU_ITEMS.map(([key, label]) => (
                <Touchable
                    key={key}
                    className={`menu-item theme-color-primary${
                        key === value ? "-light" : ""
                    }`}
                    onClick={() => onChange(key)}
                >
                    {label}
                </Touchable>
            ))}
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
