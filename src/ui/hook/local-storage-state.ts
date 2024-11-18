import JSON5 from "json5"
import * as React from "react"

/**
 * State variable that can be stored in local storage.
 * @param defaultValue Default value for initialization or
 * function that returns a value when given the last stored value or null.
 * @param storageKey Key where to store it in local storage.
 */
export function useLocalStorageState<T>(
    defaultValue: T | ((value: unknown) => T),
    storageKey: string
): [value: T, setValue: (value: T) => void] {
    const [value, setValue] = React.useState<T>(
        get<T>(storageKey, defaultValue)
    )
    React.useEffect(
        () => setValue(get<T>(storageKey, defaultValue)),
        [defaultValue, storageKey]
    )
    return [
        value,
        (newValue: T) => {
            setValue(newValue)
            window.localStorage.setItem(storageKey, JSON5.stringify(newValue))
        },
    ]
}

function get<T>(key: string, defaultValue: T | ((value: unknown) => T)): T {
    const text = window.localStorage.getItem(key)
    let value = null
    try {
        value = typeof text === "string" ? JSON5.parse(text) : null
    } catch (ex) {
        value = null
    }
    if (isFunction<T>(defaultValue)) {
        return defaultValue(value)
    }
    return value === null ? defaultValue : value
}

function isFunction<T>(data: unknown): data is (value: unknown) => T {
    return typeof data === "function"
}
