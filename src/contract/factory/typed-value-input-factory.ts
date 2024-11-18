import { TypeDef } from "../type/type-definition"
import SerializableData from "../type/serializable-data"
import EventInterface from "../tool/event"

/**
 * Create a View to edit data of a generic type.
 */
export interface TypedValueInputFactoryInterface {
    make(typeDefinition: TypeDef): TypedValueInputManager
}

export interface TypedValueInputBaseManager {
    setValue(value: SerializableData): void
    onValueChange: EventInterface<SerializableData>
    getView(): JSX.Element
}

export interface TypedValueInputManager extends TypedValueInputBaseManager {
    /**
     * We need to be generic, but at the same time we want to provide the
     * better View for the user to input data.
     * For instance, it would be helpful to provide a color picker when we
     * know that the data expect an array that will be interpreted as a color.
     *
     * For instance, a renderer expect this property in its param:
     * ```
     * "detection_far_color": [1,0,0]
     * ```
     * so we can register the color picker for this property like this:
     * ```
     * inputFactory.registerCustomView(
     *     "detection_far_color",
     *     (t: TypeDef) =>
     *         t.type === 'array'
     *         && t.subType === 'number'
     *         && t.minItems === 3,
     *     colorPickerFactory
     * )
     * ```
     */
    registerCustomView(
        path: string,
        typeMatcher: (typeDef: TypeDef) => boolean,
        factory: () => TypedValueInputBaseManager
    )
}

export type IntputTypeFilter = string | InputTypeMatcher

export type InputTypeMatcher = (typesChain: TypeDef[]) => boolean
