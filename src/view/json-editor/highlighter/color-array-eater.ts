import Color from "@/ui/color"
import { ISection } from "./types"

// A color is an array with 4 components: [Red, Green, Blue, Alpha].
const COLOR_COMPONENTS = 4

/**
 * This class will help detecting arrays of color components.
 * They are arrays with only 4 elements. Each element
 * must be a real number between 0 and 1 included.
 */
export default class ColorArrayEater {
    private readonly buffer: ISection[] = []
    private readonly colorComponents: number[] = []
    private isWaitingForNumber = true
    private endOfArrayHasBeenReached = false

    constructor(private readonly content: string) {}

    /**
     * @returns Contained text of a "symbol" section.
     * For all other type of sections, just return "".
     */
    private symbol(section: ISection): string {
        if (section.className !== "symbol") return ""
        return this.text(section)
    }

    private text(section: ISection): string {
        return this.content.substr(section.start, section.length)
    }

    /**
     * @returns true if it has eaten enough.
     */
    isSatisfied(section: ISection): boolean {
        this.buffer.push(section)
        const symbol = this.symbol(section)
        if (symbol === "]") {
            this.endOfArrayHasBeenReached = true
            return true
        }
        if (section.className === "space") return false

        if (this.isWaitingForNumber) {
            if (section.className !== "number") return true

            const value = castFloat(this.text(section), 0)
            if (value < 0 || value > 1) return true

            this.colorComponents.push(value)
            if (this.colorComponents.length > COLOR_COMPONENTS) return true

            this.isWaitingForNumber = false
        } else {
            // Is waiting for a comma.
            if (symbol !== ",") return true

            this.isWaitingForNumber = true
        }

        return false
    }

    /**
     * When this eater is satisfied, it can spit out sections.
     * If a color array has been detected, only one section
     * with the correct color style will be spit out.
     */
    spitOut(): ISection[] {
        if (
            this.endOfArrayHasBeenReached &&
            this.colorComponents.length === COLOR_COMPONENTS &&
            this.buffer.length > 1
        ) {
            // This is a color array. Yahoo!
            const [firstSection] = this.buffer
            const lastSection = this.buffer.pop() as ISection
            const color = Color.fromArrayRGB(
                this.colorComponents as [number, number, number]
            )
            return [
                {
                    className: color.stringify(),
                    start: firstSection.start,
                    length: lastSection.start - firstSection.start,
                },
                lastSection,
            ]
        }

        return this.buffer
    }
}

function castFloat(data: unknown, defaultValue: number): number {
    const value = Number(data)
    return isNaN(value) ? defaultValue : value
}
