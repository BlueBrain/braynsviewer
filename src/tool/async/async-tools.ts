/**
 * Wait for `timeout` milliseconds.
 * @param timeout Number of milliseconds to wait.
 */
async function sleep(timeout: number): Promise<void> {
    return new Promise((resolve) => window.setTimeout(resolve, timeout))
}

/**
 * The function to call as much as you want. It will perform the debouce for you.
 * Put in the same args as the `action` function.
 *
 * @param action Action to call. Two consecutive actions cannot be  called if there is
 * less than `delay` ms between them.
 * @param delay Number of milliseconds.
 */
const debounce = <F extends (...args: any[]) => any>(
    action: F,
    delay: number
) => {
    let timeout = 0

    return (...args: Parameters<F>): Promise<ReturnType<F>> =>
        new Promise((resolve) => {
            window.clearTimeout(timeout)
            timeout = window.setTimeout(() => resolve(action(...args)), delay)
        })
}

const throttle = <F extends (...args: any[]) => any>(
    action: F,
    delay: number
) => {
    let protectedTime = false
    let savedArgs: Parameters<F> | undefined
    const exec = () => {
        if (protectedTime || typeof savedArgs === "undefined") return
        protectedTime = true
        window.setTimeout(() => {
            protectedTime = false
            exec()
        }, delay)
        try {
            action(...savedArgs)
        } catch (ex) {
            console.error("Exception in a throttled function:", ex)
        } finally {
            savedArgs = undefined
        }
    }
    return (...args: Parameters<F>) => {
        savedArgs = args
        exec()
    }
}

const EXPORT = {
    sleep,
    debounce,
    throttle,
}

export default EXPORT
