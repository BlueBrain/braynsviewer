import * as React from "react"
import Button from "../../../ui/view/button"
import "./app-menu-view.css"

type Page = string

export interface AppMenuViewProps {
    className?: string
    value: Page
    onChange(page: Page): void
}

export default function AppMenuView(props: AppMenuViewProps) {
    const { value, onChange } = props
    return (
        <div className={getClassNames(props)}>
            <Button
                label="Models"
                color={value === "models" ? "primary-light" : "primary"}
                tag="models"
                onClick={onChange}
            />
            <Button
                label="Camera"
                color={value === "camera" ? "primary-light" : "primary"}
                tag="camera"
                onClick={onChange}
            />
            <Button
                label="Renderer"
                color={value === "renderer" ? "primary-light" : "primary"}
                tag="renderer"
                onClick={onChange}
            />
            <Button
                label="Broadcast"
                color={value === "broadcast" ? "primary-light" : "primary"}
                tag="broadcast"
                onClick={onChange}
            />
            <Button
                label="Entry Points"
                color={
                    value === "entrypoints" ? "primary-light" : "primary"
                }
                tag="entrypoints"
                onClick={onChange}
            />
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
