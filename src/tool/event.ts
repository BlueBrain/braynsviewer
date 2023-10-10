import { TriggerableEventInterface } from "../contract/tool/event"

/**
 * Listeners are function with only one argument of type TArgument.
 *
 * Usage example:
 * ```typescript
 * interface IPoint { x: number, y: number }
 * const onClick = new Event<IPoint>()
 * onClick.add( (point: IPoint) => ... )
 * ```
 */
export default class Event<TArgument>
    implements TriggerableEventInterface<TArgument>
{
    private listeners: Array<(arg: TArgument) => void> = []

    /**
     * @returns How many listeners are currently registred.
     */
    public get length() {
        return this.listeners.length
    }

    /**
     * @param name Any string to be used for debug purpose.
     */
    public constructor(private readonly name: string = "") {}

    /**
     * Add a listener to this event. A listener can be added only once to an event.
     * @param listener A function that expects only one parameter of type TArgument.
     */
    public add(listener: (arg: TArgument) => void) {
        this.remove(listener)
        this.listeners.push(listener)
    }

    /**
     * Call all the listeners one after the other with <argument> as unique parameter.
     * @param argument This argument will be sent to all the listeners. Be sure it is immutable.
     */
    public trigger(argument: TArgument) {
        for (const listener of this.listeners) {
            try {
                listener(argument)
            } catch (ex) {
                console.error(`[${this.name}] Error in a listener!`)
                console.error(">  ex.: ", ex)
                console.error(">  arg.: ", argument)
            }
        }
    }

    /**
     * Remove a listener from this event.
     */
    public remove(listener: (arg: TArgument) => void) {
        this.listeners = this.listeners.filter(
            (x: (arg: TArgument) => void) => x !== listener
        )
    }

    /**
     * Remove all listeners from this event.
     */
    public removeAll() {
        this.listeners.splice(0, this.listeners.length)
    }
}
