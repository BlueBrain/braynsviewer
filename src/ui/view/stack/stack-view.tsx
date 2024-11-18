import * as React from "react"

import "./stack-view.css"

const NO_ANIMATION = "none"
const DEFAULT_DURATION = 300

export interface StackViewProps {
    className?: string
    // The key of the page to display.
    value: string
    // Default: false.
    fullscreen?: boolean
    // Default: false.
    scrollable?: boolean
    animation?:
        | "none"
        | "opacity"
        | "circle"
        | "scale"
        | "slidetop"
        | "slideright"
        | "slidebottom"
        | "slideleft"
        | "covertop"
        | "coverright"
        | "coverbottom"
        | "coverleft"
    // Animation duration in milliseconds.
    duration?: number
    children: JSX.Element[]
}
export default function StackView(props: StackViewProps) {
    const { value, children, animation, duration } = props
    const refDiv = React.useRef<HTMLDivElement | null>(null)
    const refPreviousValue = React.useRef<string>(props.value)
    const refTimeoutId = React.useRef<number>(0)
    const [animating, setAnimating] = React.useState(false)
    React.useEffect(() => {
        const div = refDiv.current
        if (div) {
            div.style.setProperty(
                "--duration",
                `${duration ?? DEFAULT_DURATION}ms`
            )
        }
    })
    React.useEffect(() => {
        window.clearTimeout(refTimeoutId.current)
        setAnimating(true)
        refTimeoutId.current = window.setTimeout(() => {
            setAnimating(false)
            refPreviousValue.current = value
        }, duration ?? DEFAULT_DURATION)
    }, [value, duration])

    const [pages, extraClassNames] = manageAnimation(
        value,
        refPreviousValue.current,
        children,
        animation ?? NO_ANIMATION,
        animating
    )

    return (
        <div className={getClassNames(props, extraClassNames)} ref={refDiv}>
            {pages}
        </div>
    )
}

function manageAnimation(
    value: string,
    previousValue: string,
    children: JSX.Element[],
    animation: string,
    animating: boolean
): [JSX.Element[], string[]] {
    const newPageKey = value
    const newPageIndex = children.findIndex(
        (page: JSX.Element) => page.key === newPageKey
    )
    const newPage = children[newPageIndex]
    const pages = [newPage]
    const classNames: string[] = []

    if (animating && animation !== NO_ANIMATION) {
        const oldPageKey = previousValue
        const oldPageIndex = children.findIndex(
            (page: JSX.Element) => page.key === oldPageKey
        )
        const oldPage = children[oldPageIndex]

        classNames.push("animating", `anim-${animation}`)

        if (oldPageIndex < newPageIndex) {
            classNames.push("push")
            pages.unshift(oldPage)
        } else {
            classNames.push("pop")
            pages.push(oldPage)
        }
    }
    return [pages, classNames]
}

function getClassNames(
    props: StackViewProps,
    extraClassnames: string[]
): string {
    const { className, fullscreen, scrollable } = props
    const classNames = ["custom", "ui-view-StackView"]
    if (typeof className === "string") {
        classNames.push(className)
    }
    if (fullscreen === true) classNames.push("fullscreen")
    if (scrollable === true) classNames.push("scrollable")
    classNames.push(...extraClassnames)

    return classNames.join(" ")
}
