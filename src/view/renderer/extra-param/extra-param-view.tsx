import * as React from "react"
import { CameraExtraParams } from "../../../contract/service/camera"
import ColorInput from "../../../ui/view/input/color"
import FloatInput from "../../../ui/view/input/float"
import Checkbox from "../../../ui/view/checkbox"
import Label from "../../../ui/view/label"
import Color from "../../../ui/color"

import "./extra-param-view.css"

export interface ExtraParamViewProps {
    className?: string
    enabled: boolean
    params: CameraExtraParams
    name: string
    onChange(params: CameraExtraParams): void
}

export default function ExtraParamView(props: ExtraParamViewProps) {
    const { enabled, params, name, onChange } = props
    const value = params[name]
    const update = (v: any) => {
        onChange({
            ...params,
            [name]: v
        })
    }
    const className = getClassNames(props)
    switch (typeof value) {
        case "number":
            return (
                <FloatInput
                    className={className}
                    enabled={enabled}
                    label={name}
                    value={value}
                    onChange={update}
                />
            )
        case "boolean":
            return (
                <div className={`${className} boolean`} title={name}>
                    <Label value={name} />
                    <Checkbox
                        enabled={enabled}
                        label={value ? "true" : "false"}
                        value={value}
                        onChange={update}
                    />
                </div>
            )
    }
    if (isColor(value)) {
        const handleColorChange = (code: string) => {
            update(Color.fromColorOrString(code).toArrayRGB())
        }
        return (
            <ColorInput
                value={Color.fromArrayRGB(value).stringify()}
                label={name}
                enabled={enabled}
                onChange={handleColorChange}
                onEnterPressed={handleColorChange}
            />
        )
    }
    return (
        <div className={`${className} error`}>
            <div>{name}</div>
            <code>{JSON.stringify(value)}</code>
        </div>
    )
}

function getClassNames(props: ExtraParamViewProps): string {
    const classNames = ["custom", "view-camera-ExtraParamView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}

function isColor(data: any): data is [number, number, number] {
    if (!Array.isArray(data)) return false
    const [r, g, b] = data
    if (typeof r !== "number") return false
    if (typeof g !== "number") return false
    if (typeof b !== "number") return false
    return true
}
