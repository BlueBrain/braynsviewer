export type TypeDef =
    | BasicTypeDef
    | TypeIntegerDef
    | TypeStringEnumDef
    | TypeNumberEnumDef
    | TypeObjectDef
    | TypeArrayDef
    | TypeOneOfDef
    | TypeAnyOfDef

export interface BasicTypeDef {
    type: "string" | "number" | "boolean" | "null"
}

interface EnumValue<T> {
    value: T
    description?: string
}

export interface TypeIntegerDef {
    type: "integer"
    minimum?: number
    maximum?: number
}

export interface TypeStringEnumDef {
    type: "stringenum"
    values: EnumValue<string>[]
}

export interface TypeNumberEnumDef {
    type: "numberenum"
    values: EnumValue<number>[]
}

export interface TypeArrayDef {
    type: "array"
    minItems: number
    // If not defined, there is no limit in the number of items.
    maxItems?: number
    // Type of the array's items.
    items: TypeDef
    title?: string
}

export interface TypeObjectDef {
    type: "object"
    properties: { [key: string]: PropertyDef }
    required: string[]
    description: string
}

export type PropertyDef =
    | BasicPropertyDef
    | IntegerPropertyDef
    | StringEnumPropertyDef
    | NumberEnumPropertyDef
    | ObjectPropertyDef
    | ArrayPropertyDef
    | OneOfPropertyDef
    | AnyOfPropertyDef

export interface BasicPropertyDef extends BasicTypeDef {
    description: string
}

export interface IntegerPropertyDef extends TypeIntegerDef {
    description: string
}
export interface StringEnumPropertyDef extends TypeStringEnumDef {
    description: string
}
export interface NumberEnumPropertyDef extends TypeNumberEnumDef {
    description: string
}
export interface ObjectPropertyDef extends TypeObjectDef {
    description: string
}
export interface ArrayPropertyDef extends TypeArrayDef {
    description: string
}
export interface OneOfPropertyDef extends TypeOneOfDef {
    description: string
}
export interface AnyOfPropertyDef extends TypeAnyOfDef {
    description: string
}

export interface ParamDef {
    name: string
    description: string
    type: TypeDef
}

/**
 * In Typescript, `anyOf: [A, B, C]` will be translated
 * into `A | B | C`.
 */
export interface TypeAnyOfDef {
    anyOf: TypeDef[]
}

export interface TypeOneOfDef {
    oneOf: TypeDef[]
}
