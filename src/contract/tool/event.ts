export default interface EventInterface<T> {
    add(listener: (arg: T) => void): void
    remove(listener: (arg: T) => void): void
}

export interface TriggerableEventInterface<T> extends EventInterface<T> {
    trigger(arg: T): void
}
