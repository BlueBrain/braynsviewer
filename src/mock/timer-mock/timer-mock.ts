interface Task {
    id: number
    slot: TimerHandler
    args: any[]
    nextTime: number
    repeat: number
}

const overridenWindowObject = window as any

/**
 * This class will mock the following methods:
 * * `window.clearInterval()`
 * * `window.clearTime()`
 * * `window.setInterval()`
 * * `window.setTime()`
 * 
 * Once activated, it takes place of the real `window.*` methods.
 * You can then `run()` in time to trigger all he timed action without
 * being compelled to wait for the actual seconds to pass.
 * 
 * It makes easy to test timed functions without the need to wait.
 */
class TimerMock {
    private _id = 1
    private _time = 0
    private _activated = false
    private readonly _tasks: Task[] = []
    private readonly _setTimeout: (
        slot: TimerHandler,
        delay?: number,
        ...args: any[]
    ) => number = overridenWindowObject.setTimeout
    private readonly _clearTimeout: (id?: number) => void =
        overridenWindowObject.clearTimeout
    private readonly _setInterval: (
        slot: TimerHandler,
        delay?: number,
        ...args: any[]
    ) => number = overridenWindowObject.setInterval
    private readonly _clearInterval: (id?: number) => void =
        overridenWindowObject.clearInterval

    /**
     * Reset tho mock to time 0.
     * Destroy all pending tasks.
     */
    reset() {
        this._id = 1
        this._time = 0
        this._tasks.splice(0, this._tasks.length)
    }

    get time() {
        return this._time
    }

    /**
     * Step forward in time and to every task that has to be done in
     * this time lapse.
     * @param time The time to reach (expressed in milliseconds)
     */
    run(time: number): Promise<void> {
        if (time < this._time) {
            throw new Error("Going back in time is not allowed!")
        }

        return new Promise(resolve =>
            this._setTimeout(() => {
                this._time = time
                this.sortTasks()
                const tasks = this._tasks
                while (tasks.length > 0) {
                    const [task] = tasks
                    if (task.nextTime > time) break

                    try {
                        const { slot, args } = task
                        if (typeof slot === "string") {
                            console.warn(
                                "Please use only functions in setTimeout and setInterval, not strings."
                            )
                        } else {
                            slot(args)
                            if (task.repeat > 0) this.reschedule(task)
                        }
                    } catch (ex) {
                        console.error("Exception occured in:", task)
                        console.error("Detail of the error:", ex)
                    } finally {
                        tasks.shift()
                    }
                }
                resolve()
            })
        )
    }

    get activated() {
        return this._activated
    }
    set activated(activated: boolean) {
        if (activated === this.activated) return

        if (activated) {
            overridenWindowObject.clearInterval = this.clearInterval
            overridenWindowObject.clearTimeout = this.clearTimeout
            overridenWindowObject.setInterval = this.setInterval
            overridenWindowObject.setTimeout = this.setTimeout
        } else {
            overridenWindowObject.clearInterval = this._clearInterval
            overridenWindowObject.clearTimeout = this._clearTimeout
            overridenWindowObject.setInterval = this._setInterval
            overridenWindowObject.setTimeout = this._setTimeout
        }
        this._activated = activated
    }

    reschedule(task: Task) {
        const tasks = this._tasks
        const newTask: Task = {
            ...task,
            nextTime: task.nextTime + task.repeat
        }
        const index = tasks.findIndex(t => t.nextTime > newTask.nextTime)
        if (index < 0) tasks.push(newTask)
        else tasks.splice(index, 0, newTask)
    }

    private sortTasks() {
        this._tasks.sort((a, b) => a.nextTime - b.nextTime)
    }

    readonly setTimeout = (slot: TimerHandler, delay?: number, ...args: any[]) => {
        const id = this._id++
        this._tasks.push({
            id,
            nextTime: this._time + (delay ?? 0),
            repeat: 0,
            slot,
            args
        })
        return id
    }

    readonly setInterval = (slot: TimerHandler, delay?: number, ...args: any[]) => {
        const id = this._id++
        this._tasks.push({
            id,
            nextTime: this._time + (delay ?? 0),
            repeat: delay ?? 0,
            slot,
            args
        })
        return id
    }

    readonly clearTimeout = (id: number | undefined): void => {
        if (typeof id !== "number") return

        const tasks = this._tasks
        const index = tasks.findIndex(task => task.id === id)
        if (index > -1) tasks.splice(index, 1)
    }

    readonly clearInterval = this.clearTimeout
}

export default new TimerMock()
