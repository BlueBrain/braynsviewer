import { isType } from "@/tool/type-check"
import Color from "@/ui/color"
import InputFloat from "@/ui/view/input/float"
import * as React from "react"
import "./vector3-view.css"

export interface Vector3ViewProps {
    className?: string
    value: unknown
    onChange(this: void, value: [number, number, number]): void
}

export default function Vector3View(props: Vector3ViewProps) {
    const { onChange } = props
    const value: [number, number, number] = sanitize(props.value)
    const color = Color.fromArrayRGB(value).stringify()
    return (
        <div className={getClassNames(props)}>
            <div className="array">
                <InputFloat
                    value={value[0]}
                    onChange={(v) => onChange([v, value[1], value[2]])}
                />
                <InputFloat
                    value={value[1]}
                    onChange={(v) => onChange([value[0], v, value[2]])}
                />
                <InputFloat
                    value={value[2]}
                    onChange={(v) => onChange([value[0], value[1], v])}
                />
            </div>
            <input
                type="color"
                value={color}
                onChange={(evt) => {
                    const text = evt.target.value
                    const c = new Color(text)
                    onChange(c.toArrayRGB())
                }}
            />
        </div>
    )
}

function getClassNames(props: Vector3ViewProps): string {
    const classNames = ["custom", "view-loaders-detail-field-Vector3View"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}

function sanitize(value: unknown): [number, number, number] {
    if (!isType<[number, number, number]>(value, ["array(3)", "number"]))
        return [0, 0, 0]

    return value
}
