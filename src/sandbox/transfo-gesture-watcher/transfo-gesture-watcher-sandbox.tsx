import React from "react"
import ReactDOM from "react-dom"
import TransfoGestureWatcher from "../../watcher/transfo-gesture"
import { makeEvent } from "../../factory/global"
import TransfoGestureWatcherInterface from "../../contract/watcher/transfo-gesture"

const EXPORT = {
    start() {
        const watcher = new TransfoGestureWatcher(makeEvent)
        const root = document.getElementById("root") as HTMLElement
        ReactDOM.render(<SandBox watcher={watcher} />, root)
    }
}

export default EXPORT

interface SandBoxProps {
    watcher: TransfoGestureWatcherInterface
}

function SandBox(props: SandBoxProps) {
    const refDiv = React.useRef<HTMLDivElement | null>(null)
    const [contentOrbit, setContentOrbit] = React.useState("Orbit...")
    const [contentMove, setContentMove] = React.useState("Move...")
    const [contentZoom, setContentZoom] = React.useState("Zoom...")
    React.useEffect(() => {
        if (!refDiv.current) return
        props.watcher.element = refDiv.current
        props.watcher.eventOrbit.add(evt =>
            setContentOrbit("Orbit:\n" + JSON.stringify(evt, null, "  "))
        )
        props.watcher.eventMove.add(evt =>
            setContentMove("Move:\n" + JSON.stringify(evt, null, "  "))
        )
        props.watcher.eventZoom.add(evt =>
            setContentZoom("Zoom: " + JSON.stringify(evt, null, "  "))
        )
    }, [props.watcher])
    return (
        <div
            style={{
                padding: "1rem",
                margin: "5rem",
                width: "50vw",
                height: "50vh",
                backgroundColor: "orange"
            }}
            ref={refDiv}
        >
            <pre>{contentZoom}</pre>
            <pre>{contentMove}</pre>
            <pre>{contentOrbit}</pre>
        </div>
    )
}
