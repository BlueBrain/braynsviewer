import * as React from "react"

/**
 * Same as React.useEffect, but the effect is debounced.
 * @param delay Number of milliseconds for debouncing.
 */
export function useDebouncedEffect(
    effect: React.EffectCallback,
    delay: number,
    deps?: React.DependencyList | undefined
): void {
    const refTimeout = React.useRef(-1)
    React.useEffect(()=>{
        window.clearTimeout(refTimeout.current)
        refTimeout.current = window.setTimeout(effect, delay)
    }, deps)
}
