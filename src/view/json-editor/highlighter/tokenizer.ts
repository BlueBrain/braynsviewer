import { IRule, ISection } from "./types"

/**
 * Reduce a content into an array of tokens.
 * Each token is made of a className, a starting position and a length.
 *
 * @param content String content we want to tokenize.
 * @param rules Rules to be tested one after the other.
 * The first matching one will return the className of a section: the token.
 * @param errorClassName If no rule match, then the rest of the content will
 * become an entire section with __errorClassName__ as className.
 */
export function tokenize(
    content: string,
    rules: IRule[],
    errorClassName = "error"
): ISection[] {
    const sections: ISection[] = []
    let index = 0
    while (index < content.length) {
        const restOfContent = content.substr(index)
        let hasMatchedSomething = false
        for (const [className, rx] of rules) {
            rx.lastIndex = -1
            const matcher = rx.exec(restOfContent)
            if (!matcher) continue

            const [matchedItem] = matcher
            sections.push({
                className,
                start: index,
                length: matchedItem.length,
            })
            index += matchedItem.length
            hasMatchedSomething = true
            break
        }
        if (!hasMatchedSomething) {
            // We mark all the rest as error.
            sections.push({
                className: errorClassName,
                start: index,
                length: content.length - index,
            })
            break
        }
    }

    return sections
}

export function filter(
    sections: ISection[],
    classNamesToRemove: string[]
): ISection[] {
    return sections.filter(
        (section) => !classNamesToRemove.includes(section.className)
    )
}
