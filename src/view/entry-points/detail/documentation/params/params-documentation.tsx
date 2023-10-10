import { TypeDef } from "@/contract/service/entry-points"
import {
    BasicTypeDef,
    TypeAnyOfDef,
    TypeArrayDef,
    TypeIntegerDef,
    TypeObjectDef,
    TypeOneOfDef,
} from "@/contract/type/type-definition"
import { isObject, isStringArray } from "@/tool/type-check"
import * as React from "react"
import "./params-documentation.css"

export interface ParamsDocumentationProps {
    className?: string
    params: TypeDef
}

export default function ParamsDocumentation(props: ParamsDocumentationProps) {
    const { params } = props
    return (
        <div className={getClassNames(props)}>
            <div className="param">{renderType(params)}</div>
        </div>
    )
}

function renderType(type: TypeDef): JSX.Element {
    if (isTypeUndefined(type)) {
        return (
            <>
                <span className="type">UNDEF</span>{" "}
            </>
        )
    }
    if (isTypeEnum(type)) {
        return (
            <>
                <span className="type">ENUM</span>{" "}
                <code>
                    {"{ "}
                    {type.enum.map((item) => JSON.stringify(item)).join(", ")}
                    {" }"}
                </code>
            </>
        )
    }
    if (isTypeInteger(type)) {
        return (
            <>
                <span className="type">INT</span>{" "}
                {renderIntegerBoundaries(type)}
            </>
        )
    }
    if (isTypeBasic(type)) {
        return (
            <>
                <span className="type">{type.type.toUpperCase()}</span>
            </>
        )
    }
    if (isTypeArray(type)) {
        return (
            <>
                <span className="type">
                    ARRAY[{type.minItems}
                    {typeof type.maxItems === "number" &&
                    type.minItems < type.maxItems
                        ? `..${type.maxItems}`
                        : ""}
                    ]
                </span>{" "}
                of {renderType(type.items)}
            </>
        )
    }
    if (isTypeOneOf(type)) {
        return (
            <>
                <span className="type">
                    One among {type.oneOf.length} types
                </span>
                <ol>
                    {type.oneOf.map((item) => (
                        <li>
                            {renderTitle(item)}
                            {renderType(item)}
                        </li>
                    ))}
                </ol>
            </>
        )
    }
    if (isTypeAnyOf(type)) {
        return (
            <>
                <span className="type">Any of {type.anyOf.length} types</span>
                <ol>
                    {type.anyOf.map((item) => (
                        <li>
                            {renderTitle(item)}
                            {renderType(item)}
                        </li>
                    ))}
                </ol>
            </>
        )
    }
    if (isTypeObject(type)) {
        const propertyNames: string[] = Object.keys(type.properties)
        if (propertyNames.length === 0)
            return <span className="type">DICTIONARY</span>
        return (
            <ul>
                {propertyNames.map((propertyName) => {
                    const property = type.properties[propertyName]
                    return (
                        <li key={propertyName}>
                            <span
                                className={`property ${
                                    type.required.includes(propertyName)
                                        ? "required"
                                        : "optional"
                                }`}
                            >
                                {propertyName}
                            </span>
                            :{" "}
                            <span className="desc">{property.description}</span>
                            {renderType(property)}
                        </li>
                    )
                })}
            </ul>
        )
    }
    if (isTypeVoid(type)) {
        return <span className="type">VOID</span>
    }
    console.warn("🚀 [params-documentation] Don't know what it is = ", type)
    return <pre>{JSON.stringify(type)}</pre>
}

function getClassNames(props: ParamsDocumentationProps): string {
    const classNames = [
        "custom",
        "view-entryPoints-detail-documentation-ParamsDocumentation",
    ]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}

function isTypeInteger(data: unknown): data is TypeIntegerDef {
    if (!isObject(data)) return false
    const { type } = data
    return type === "integer"
}

function isTypeUndefined(data: unknown): data is BasicTypeDef {
    if (!isObject(data)) return false
    const { type } = data
    return type === "undefined"
}

function isTypeEnum(data: unknown): data is { enum: string[] } {
    if (!isObject(data)) return false
    return isStringArray(data.enum)
}

function isTypeBasic(data: unknown): data is BasicTypeDef {
    if (!isObject(data)) return false
    const { type } = data
    return (
        type === "string" ||
        type === "number" ||
        type === "boolean" ||
        type === "null"
    )
}

function isTypeVoid(data: unknown): data is TypeDef {
    if (!isObject(data)) return false
    return Object.keys(data).length === 0
}

function isTypeObject(data: unknown): data is TypeObjectDef {
    if (!isObject(data)) return false
    const { type } = data
    return type === "object"
}

function isTypeArray(data: unknown): data is TypeArrayDef {
    if (!isObject(data)) return false
    const { type } = data
    return type === "array"
}

function isTypeOneOf(data: unknown): data is TypeOneOfDef {
    if (!isObject(data)) return false
    return typeof data.oneOf !== "undefined"
}

function isTypeAnyOf(data: unknown): data is TypeAnyOfDef {
    if (!isObject(data)) return false
    return typeof data.anyOf !== "undefined"
}

/**
 * Integers can have minimum and/or maximum values.
 * When need to display this information when available.
 */
function renderIntegerBoundaries(type: TypeIntegerDef) {
    const parts: string[] = []
    if (typeof type.minimum === "number") parts.push(`min: ${type.minimum}`)
    if (typeof type.maximum === "number") parts.push(`max: ${type.maximum}`)
    if (parts.length === 0) return ""
    return `(${parts.join(", ")})`
}

function renderTitle(item: TypeDef) {
    if (!isObject(item)) return null

    const { title } = item
    if (typeof title === "string") return <span className="desc">{title}</span>
}
