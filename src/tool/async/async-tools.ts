/**
 * Wait for `timeout` milliseconds.
 * @param timeout Number of milliseconds to wait.
 */
export async function sleep(timeout: number): Promise<void> {
    return new Promise((resolve) => {
        window.setTimeout(resolve, timeout)
    })
}

/**
 * The function to call as much as you want. It will perform the debouce for you.
 * Put in the same args as the `action` function.
 *
 * @param action Action to call. Two consecutive actions cannot be  called if there is
 * less than `delay` ms between them.
 * @param delay Number of milliseconds.
 */
export const debounce = <T, F extends (...args: never[]) => T>(
    action: F,
    delay: number
) => {
    let timeout = 0

    return (...args: Parameters<F>): Promise<T> =>
        new Promise((resolve) => {
            window.clearTimeout(timeout)
            timeout = window.setTimeout(() => resolve(action(...args)), delay)
        })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const throttle = <F extends (...args: any[]) => any>(
    action: F,
    delay: number
) => {
    let protectedTime = false
    let savedArgs: Parameters<F> | null = null
    const exec = () => {
        if (protectedTime || savedArgs === null) return
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
            savedArgs = null
        }
    }
    return (...args: Parameters<F>) => {
        savedArgs = args
        exec()
    }
}

/**
 * This job will be executed if no other job is executing.
 * Otherwise, it will be put on a waiting queue.
 * But this queue has only one place, so if you call `exec()`
 * again before this job has had a chance to be executed,
 * it will be lost (never executed).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const squash = <T, F extends (...args: any[]) => Promise<T>>(
    action: F
) => {
    let nextJob: null | unknown[] = null
    let isWorking = false

    return async (...job: unknown[]) => {
        nextJob = job
        if (isWorking) return

        isWorking = true
        while (nextJob !== null) {
            const currentJob = nextJob
            nextJob = null
            try {
                // Await in a loop is expected for squash.
                // eslint-disable-next-line no-await-in-loop
                await action(...currentJob)
            } catch (ex) {
                console.error("Exception occured during squashed job:", ex)
                console.error(currentJob)
            }
        }
        isWorking = false
    }
}

const DEFAULT = {
    debounce,
    sleep,
    squash,
    throttle,
}

export default DEFAULT
