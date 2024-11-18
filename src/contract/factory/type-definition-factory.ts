import { TypeDef } from "../type/type-definition"

export interface TypeDefinitionFactoryInterface {
    /**
     * Brayns exposes its interface through REST and entry point `schema`.
     * The string emitted by Brayns is a stringified JSON Schema dialect.
     * This factory allow the rest of the code to work with TypeDef without
     * relying on the JSON Schema dialect that can change anytime.
     * @param definition Stringified JSON object
     * @see https://json-schema.org
     */
    make(definition: string): TypeDef
}
