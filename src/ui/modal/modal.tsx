import React from "react"
import ReactDOM from "react-dom"
import IconFactory from "../factory/icon"
import Dialog from "../view/dialog"
import { ColorName } from "../view/types"
import "./modal.css"

export interface ModalOptions {
    align: "" | "L" | "R" | "T" | "B" | "BL" | "LB" | "BR" | "TL" | "LT" | "TR"

    padding: string
    transitionDuration: number
    /**
     * Default to `true`. If `true` the modal window can be closed by
     * clicking outside its frame or by pressing ESC on the keyboard.
     */
    autoClosable?: boolean
    /**
     * This function is called when the modal window is closed by
     * the ESC key or by a click outside its frame.
     */
    onClose?(): void
}

export interface ConfirmOptions extends Partial<ModalOptions> {
    /** Message to display */
    content: string | JSX.Element
    /** If defined, it will be the header of the modal dialog box. */
    title?: string
    /** Color of the OK button. Default to "primary". */
    colorOK?: ColorName
    /** Default to `title` or "OK" if undefined. */
    labelOK?: string
    /** Default to "Cancel". */
    labelCancel?: string
}

export default class Modal {
    private readonly screen: HTMLDivElement
    private readonly frame: HTMLDivElement
    private readonly options: ModalOptions
    private timeoutId = 0

    constructor(options: Partial<ModalOptions> = {}) {
        this.options = {
            align: "",
            padding: "1rem",
            transitionDuration: 300,
            ...options,
        }
        const screen = createScreen(this.options)
        const frame = document.createElement("div")
        screen.appendChild(frame)
        this.screen = screen
        this.frame = frame
    }

    show(view: JSX.Element) {
        window.clearTimeout(this.timeoutId)
        const { screen, frame } = this
        ReactDOM.render(view, frame)
        window.document.body.appendChild(screen)
        window.setTimeout(() => screen.classList.add("show"))
    }

    readonly hide = () => {
        const { screen, options } = this
        screen.classList.remove("show")
        this.timeoutId = window.setTimeout(() => {
            window.document.body.removeChild(screen)
        }, options.transitionDuration)
    }

    static async confirm(options: ConfirmOptions): Promise<boolean> {
        return new Promise((resolve) => {
            const modal = new Modal({
                autoClosable: true,
                ...options,
            })
            const hide = (value: boolean) => {
                modal.hide()
                resolve(value)
            }
            modal.show(
                <Dialog
                    colorOK={options.colorOK}
                    title={options.title}
                    labelOK={options.labelOK ?? options.title ?? "OK"}
                    labelCancel={options.labelCancel ?? "Cancel"}
                    onOK={() => hide(true)}
                    onCancel={() => hide(false)}
                >
                    {options.content}
                </Dialog>
            )
        })
    }

    static async info(
        content: JSX.Element | string,
        options: Partial<ModalOptions> = {}
    ): Promise<void> {
        return new Promise((resolve) => {
            const modal = new Modal(options)
            const hide = () => {
                modal.hide()
                resolve()
            }
            modal.show(
                <Dialog
                    hideCancel={true}
                    flat={true}
                    labelOK="Got it"
                    onOK={hide}
                >
                    {content}
                </Dialog>
            )
        })
    }

    static async error(
        content: JSX.Element | string,
        options: Partial<ModalOptions> = {}
    ): Promise<void> {
        return new Promise((resolve) => {
            const modal = new Modal(options)
            const hide = () => {
                modal.hide()
                resolve()
            }
            modal.show(
                <Dialog hideCancel={true} labelOK="OK" onOK={hide}>
                    <div className="ui-Modal-error">{content}</div>
                </Dialog>
            )
        })
    }

    /**
     * Wait for a promise resolution and display an animation in the meantime.
     * @param content Text or element to display along the spinning icon.
     * @param promise The promise to wait on.
     */
    static async wait<T>(
        content: JSX.Element | string,
        promise: Promise<T>,
        options: Partial<ModalOptions> = {}
    ): Promise<T> {
        return new Promise((resolve, reject) => {
            const modal = new Modal(options)
            modal.show(
                <div className="ui-Modal-promise-waiter">
                    {IconFactory.make("refresh")}
                    {content}
                </div>
            )
            const hide = (arg: T) => {
                modal.hide()
                resolve(arg)
            }
            promise.then(hide, (ex) => {
                modal.hide()
                reject(ex)
            })
        })
    }
}

function createScreen(options: ModalOptions) {
    const screen = document.createElement("div")
    screen.classList.add("ui-Modal")
    addClassesForAlign(screen, options.align ?? "")
    applyPadding(screen, options.padding)
    applyTransition(screen, options.transitionDuration)
    return screen
}

function addClassesForAlign(screen: HTMLDivElement, align: string) {
    const items = align.split("")
    if (items.includes("L")) screen.classList.add("align-left")
    if (items.includes("R")) screen.classList.add("align-right")
    if (items.includes("T")) screen.classList.add("align-top")
    if (items.includes("B")) screen.classList.add("align-bottom")
}

function applyPadding(screen: HTMLDivElement, padding: string) {
    screen.style.setProperty("--padding", padding)
}

function applyTransition(screen: HTMLDivElement, transitionDuration: number) {
    screen.style.setProperty(
        "--transition-duration",
        `${Math.floor(transitionDuration)}ms`
    )
}
