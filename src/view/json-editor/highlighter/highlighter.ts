import Color from "@/ui/color"
import ColorArrayEater from "./color-array-eater"
import Rules from "./rules"
import { tokenize } from "./tokenizer"

export interface ISection {
    start: number
    length: number
    className: string
}

export function highlightJSON5(
    content: string,
    providedSections?: ISection[]
): string {
    const sections = providedSections ?? tokenize(content, Rules.JSON5_RULES)
    const finalSections: ISection[] = []
    let prvSection: ISection | null = null
    let eater: ColorArrayEater | null = null
    for (const section of sections) {
        if (eater) {
            if (eater.isSatisfied(section)) {
                finalSections.push(...eater.spitOut())
                eater = null
            }
            continue
        }

        finalSections.push(section)
        if (
            !section ||
            section.className === "space" ||
            section.className === "comment"
        ) {
            // Spaces and comments have no semantic.
            continue
        }
        if (prvSection && section.className === "symbol") {
            const symbol = content.substring(
                section.start,
                section.start + section.length
            )
            if (symbol === ":") {
                // Identify "keys". There are just after a colon (":").
                prvSection.className = "key"
            } else if (symbol === "[") {
                eater = new ColorArrayEater(content)
            }
        }
        prvSection = section
    }

    return toHTML(content, finalSections)
}

function toHTML(content: string, sections: ISection[]): string {
    return sections.map((section) => mapSection(content, section)).join("")
}

function mapSection(content: string, section: ISection) {
    const { className } = section
    const text = content.substr(section.start, section.length)
    if (className.charAt(0) === "#") {
        const bgColor = new Color(className).stringify()
        return `<span style="text-decoration: underline ${bgColor};color:#000;text-underline-offset:1px;text-decoration-thickness:5px;text-decoration-skip-ink:none">${text}</span>`
    }
    return `<span class=${section.className}>${text}</span>`
}
