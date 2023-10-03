import * as React from "react"
import { LoaderDefinition } from "../../../../contract/service/loaders"

interface Values {
    [key: string]: unknown
}

/**
 * Manage the values of the properties of a loader.
 * This is automatically updated when `loader` changes.
 */
export function useLoaderValues(
    loader?: LoaderDefinition
): [Values, (values: Values) => void] {
    const [values, setValues] = React.useState<Values>({})
    React.useEffect(() => {
        if (!loader) {
            setValues({})
        } else {
            const { properties } = loader
            const result: { [key: string]: unknown } = {}
            for (const property of properties) {
                result[property.name] = property.defaultValue
            }
            setValues(result)
        }
    }, [loader])
    return [values, setValues]
}
