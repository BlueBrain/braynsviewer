/**
 * Watch the state of meta keys (like Ctrl, Alt, Shift, ...) and mouse buttons.
 */
class KeysWatcher {
    constructor() {
        window.document.addEventListener("keydown", this.handleKeyDown, true)
        window.document.addEventListener("keyup", this.handleKeyUp, true)
        window.document.addEventListener(
            "mousedown",
            this.handleMouseDown,
            true
        )
        window.document.addEventListener("mouseup", this.handleMouseUp, true)
    }

    get altIsPressed() {
        return this.altKey
    }

    get controlIsPressed() {
        return this.ctrlKey
    }

    get shiftIsPressed() {
        return this.shiftKey
    }

    get leftMouseButtonPressed() {
        return this.leftMouseButton
    }

    get middleMouseButtonPressed() {
        return this.middleMouseButton
    }

    get rightMouseButtonPressed() {
        return this.rightMouseButton
    }

    private altKey = false
    private ctrlKey = false
    private shiftKey = false
    private leftMouseButton = false
    private middleMouseButton = false
    private rightMouseButton = false

    private readonly handleKeyDown = (evt: KeyboardEvent) => {
        switch (evt.key) {
            case "Control":
                this.ctrlKey = true
                break
            case "Alt":
                this.altKey = true
                break
            case "Shift":
                this.shiftKey = true
                break
        }
    }

    private readonly handleKeyUp = (evt: KeyboardEvent) => {
        switch (evt.key) {
            case "Control":
                this.ctrlKey = false
                break
            case "Alt":
                this.altKey = false
                break
            case "Shift":
                this.shiftKey = false
                break
        }
    }

    private readonly handleMouseDown = (evt: MouseEvent) => {
        if (evt.button === 0) this.leftMouseButton = true
        else if (evt.button === 1) this.middleMouseButton = true
        else if (evt.button === 2) this.rightMouseButton = true
    }

    private readonly handleMouseUp = (evt: MouseEvent) => {
        if (evt.button === 0) this.leftMouseButton = false
        else if (evt.button === 1) this.middleMouseButton = false
        else if (evt.button === 2) this.rightMouseButton = false
    }
}

export default new KeysWatcher()
