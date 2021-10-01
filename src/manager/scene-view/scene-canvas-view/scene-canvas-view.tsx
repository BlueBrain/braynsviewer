import * as React from "react"
import { ResizeListenerInterface } from "../../../contract/watcher/resize"
import { makeResizeWatcher } from "../../../factory/global"
import "./scene-canvas-view.css"

export interface SceneCanvasViewProps {
    className?: string
    onCanvasReady(canvas: HTMLCanvasElement): void
    onSizeChange(size: { width: number; height: number }): void
}

/**
 * Responsibility:
 *  - Display a canvas
 *  - Keep canvas pixel size in sync with canvas DOM size.
 *  - Trigger when ready and when size has changed
 */
export default function SceneCanvasView(props: SceneCanvasViewProps) {
    const [firstRender, setFirstRender] = React.useState(true)
    const refCanvas = React.useRef<HTMLCanvasElement>(null)
    const canvas = refCanvas.current

    React.useEffect(() => {
        const handleResize: ResizeListenerInterface = (elem, width, height) => {
            elem.setAttribute("width", `${width}`)
            elem.setAttribute("height", `${height}`)
            props.onSizeChange({ width, height })
        }
        const watcher = makeResizeWatcher()
        if (canvas) {
            props.onCanvasReady(canvas)
            watcher.register(canvas, handleResize)
            const { width, height } = canvas.getBoundingClientRect()
            handleResize(canvas, width, height)
        } else {
            // At first render, canvas is null.
            setFirstRender(false)
        }
        return () => {
            if (canvas) {
                watcher.unregister(canvas, handleResize)
            }
        }
    }, [firstRender, props, canvas])
    return <canvas ref={refCanvas} className={getClassNames(props)}></canvas>
}

function getClassNames(props: SceneCanvasViewProps): string {
    const classNames = ["custom", "factory-sceneViewFactory-SceneCanvasView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}
