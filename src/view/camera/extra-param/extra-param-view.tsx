import * as React from "react"
import { CameraExtraParams } from "../../../contract/service/camera"
import FloatInput from "../../../ui/view/input/float"
import Checkbox from "../../../ui/view/checkbox"
import Label from "../../../ui/view/label"

import "./extra-param-view.css"

export interface ExtraParamViewProps {
    className?: string
    enabled: boolean
    params: CameraExtraParams
    name: string
    onChange(this: void, params: CameraExtraParams): void
}

export default function ExtraParamView(props: ExtraParamViewProps) {
    const { enabled, params, name, onChange } = props
    const value = params[name]
    const update = (
        v: number | boolean | string | [number, number, number]
    ) => {
        onChange({
            ...params,
            [name]: v,
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
