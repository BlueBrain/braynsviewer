import { LoaderPropertyDefinition } from "@/contract/service/loaders"
import InputFloat from "@/ui/view/input/float"
import InputInteger from "@/ui/view/input/integer"
import InputText from "@/ui/view/input/text"
import Options from "@/ui/view/options"
import Combo from "@/ui/view/simple-combo"
import JSON5 from "json5"
import * as React from "react"
import { isArray } from "../../../../tool/type-check"
import JsonEditorView from "../../../json-editor/json-editor-view"
import "./field-view.css"
import Vector3Field from "./vector3"

export interface FieldViewProps {
    className?: string
    property: LoaderPropertyDefinition
    values: { [key: string]: any }
    onChange(values: { [key: string]: any }): void
}

export default function FieldView(props: FieldViewProps) {
    const { property, values, onChange } = props
    const value = values[property.name]
    return (
        <div className={getClassNames(props)}>
            <b>{property.name}</b> <small>({property.title})</small>
            {renderProperty(property, value, (newValue: any) => {
                if (JSON.stringify(value) === JSON.stringify(newValue)) return
                onChange({ ...values, [property.name]: newValue })
            })}
            <p>{property.description}</p>
        </div>
    )
}

function getClassNames(props: FieldViewProps): string {
    const classNames = ["custom", "view-loaders-detail-FieldView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }
    classNames.push(getTypeClassName(props.property.type))

    return classNames.join(" ")
}

function renderProperty(
    property: LoaderPropertyDefinition,
    value: any,
    onChange: (value: any) => void
) {
    if (Array.isArray(property.type)) {
        return (
            <Combo
                wide={true}
                value={value}
                values={property.type}
                onChange={onChange}
            />
        )
    }
    switch (property.type) {
        case "vector3":
            return <Vector3Field value={value} onChange={onChange} />
        case "string":
            return (
                <InputText
                    label="String"
                    wide={true}
                    value={value}
                    onChange={onChange}
                />
            )
        case "number":
            return (
                <InputFloat
                    label="Float number"
                    wide={true}
                    value={value}
                    onChange={onChange}
                />
            )
        case "integer":
            return (
                <InputInteger
                    label="Integer"
                    wide={true}
                    value={value}
                    onChange={onChange}
                />
            )
        case "boolean":
            return (
                <Options
                    options={{
                        true: "True",
                        false: "False",
                    }}
                    value={value === true ? "true" : "false"}
                    onClick={(key) => onChange(key === "true")}
                ></Options>
            )
        default:
            return (
                <>
                    <JsonEditorView
                        label="JSON Format"
                        value={JSON5.stringify(value) ?? "undefined"}
                        onChange={(text) => {
                            try {
                                onChange(JSON5.parse(text ?? "undefined"))
                            } catch (ex) {
                                console.error("Unble to parse JSON5:", ex)
                            }
                        }}
                    />
                    <pre>{JSON.stringify(property, null, "  ")}</pre>
                </>
            )
    }
}

/**
 * With a classname for every type, we can adjust some margins.
 */
function getTypeClassName(type: string | string[] | undefined): string {
    if (!type) return "undefined"
    if (isArray(type)) return "enum"
    return type
}
