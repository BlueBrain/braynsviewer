export default class CssVarManager {
    private readonly target: HTMLElement | SVGElement

    constructor(target?: HTMLElement | SVGElement) {
        this.target = target ?? window.document.body
    }

    set(name: string, value: string) {
        this.target.style.setProperty(this.sanitizeName(name), value)
    }

    get(name: string): string {
        return this.target.style.getPropertyValue(this.sanitizeName(name))
    }

    private sanitizeName(name: string) {
        return name.startsWith("--") ? name : `--${name}`
    }
}