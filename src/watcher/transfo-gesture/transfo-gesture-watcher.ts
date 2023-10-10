import { Manager, Input as HammerInput } from "hammerjs"
import { TriggerableEventInterface } from "../../contract/tool/event"
import TransfoGestureWatcherInterface, {
    TranslationEvent,
} from "../../contract/watcher/transfo-gesture"
import Keys from "./keys-watcher"

class HammerManager extends Manager {}

export default class TransfoGestureWatcher
    implements TransfoGestureWatcherInterface
{
    public readonly eventOrbit: TriggerableEventInterface<TranslationEvent>
    public readonly eventMove: TriggerableEventInterface<TranslationEvent>
    public readonly eventZoom: TriggerableEventInterface<number>

    constructor(makeEvent: <T>() => TriggerableEventInterface<T>) {
        this.eventOrbit = makeEvent()
        this.eventMove = makeEvent()
        this.eventZoom = makeEvent()
    }

    public get element() {
        return this._element
    }
    public set element(element: HTMLElement | SVGElement | undefined) {
        if (element === this._element) return

        if (this._element) this.detach()
        this._element = element
        this.attach()
    }

    private _element: HTMLElement | SVGElement | undefined
    private _manager?: HammerManager
    // Used to simulate mouse wheel with a pinch gesture.
    private _lastWheelFakeValue = 1
    private xOrigin = 0
    private yOrigin = 0

    private detach() {
        if (!this._element) return

        this._element.removeEventListener("contextmenu", this.handleContextMenu)
        if (this._manager)
            this._manager.off("panstart panmove panend", this.handleHammerInput)
        this._element.removeEventListener("wheel", this.handleWheel)
    }

    private attach() {
        if (!this._element) return

        this._element.addEventListener("contextmenu", this.handleContextMenu)
        const manager = new window.Hammer.Manager(this._element)
        manager.add(
            new window.Hammer.Pan({
                pointers: 1,
            })
        )
        const pan = new window.Hammer.Pan({
            event: "pan2",
            pointers: 2,
        })
        const pintch = new window.Hammer.Pinch({ threshold: 0.1 })
        manager.add(pan)
        manager.add(pintch)
        manager.on(
            "panstart panmove panend pan2start pan2move pan2end pinch",
            this.handleHammerInput
        )
        this._manager = manager

        this._element.addEventListener("wheel", this.handleWheel)
    }

    private readonly handleContextMenu = (evt: Event) => evt.preventDefault()

    private readonly handleHammerInput = (evt: HammerInput) => {
        if (
            evt.type.startsWith("pan2") ||
            Keys.altIsPressed ||
            Keys.rightMouseButtonPressed
        ) {
            this.eventMove.trigger(this.toTranslationEvent(evt))
        } else if (evt.type.startsWith("pan")) {
            this.handlePanOneFinger(evt)
        } else {
            this.handlePintch(evt)
        }
    }

    private readonly handlePanOneFinger = (evt: HammerInput) => {
        this.eventOrbit.trigger(this.toTranslationEvent(evt))
    }

    private readonly handlePintch = (evt: HammerInput) => {
        const { scale } = evt
        if (scale <= 0) return

        if (evt.type === "pinchstart") {
            this._lastWheelFakeValue = 1
        }
        const FACTOR = 1000
        const wheelFakeValue = FACTOR * (scale > 0 ? scale : -1 / scale)
        const delta = wheelFakeValue - this._lastWheelFakeValue
        this._lastWheelFakeValue = wheelFakeValue
        this.eventZoom.trigger(delta)
    }

    private readonly handleWheel = (evt: WheelEvent) => {
        const STEP = 100
        this.eventZoom.trigger(evt.deltaY > 0 ? STEP : -STEP)
    }

    private toTranslationEvent(evt: HammerInput): TranslationEvent {
        const isBegin = evt.type.endsWith("start")
        if (isBegin) {
            this.xOrigin = evt.center.x
            this.yOrigin = evt.center.y
        }
        const scale = Keys.controlIsPressed ? 4 : Keys.shiftIsPressed ? 0.25 : 1
        return {
            isBegin,
            isEnd: evt.type.endsWith("end"),
            xOrigin: this.xOrigin,
            yOrigin: this.yOrigin,
            x: scale * evt.deltaX,
            y: scale * evt.deltaY,
        }
    }
}
