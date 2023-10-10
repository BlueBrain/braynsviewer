import SpontaneousUpdatesServiceInterface, {
    SpontaneousUpdateItem,
} from "@/contract/service/spontaneous-updates"
import AsyncTool from "@/tool/async"
import * as React from "react"
import "./spontaneous-updates-view.css"
import UpdateButton from "./update-button"

const REFRESH_THRESHOLD = 500

export interface SpontaneousUpdatesViewProps {
    className?: string
    service: SpontaneousUpdatesServiceInterface
}

export default function SpontaneousUpdatesView(
    props: SpontaneousUpdatesViewProps
) {
    const { service } = props
    const [history, setHistory] = React.useState<SpontaneousUpdateItem[]>([])
    React.useEffect(() => {
        const handleRefresh = AsyncTool.throttle(
            (svc: SpontaneousUpdatesServiceInterface) => {
                setHistory(svc.updatesHistory)
            },
            REFRESH_THRESHOLD
        )
        setHistory(service.updatesHistory)
        service.eventNewUpdate.add(handleRefresh)
        return () => service.eventNewUpdate.remove(handleRefresh)
    }, [service])

    return (
        <div className={getClassNames(props)}>
            <h1>Brayns broadcasts history</h1>
            {history.length === 0 && (
                <p>
                    No broadcast has been received since you started Brayns
                    Viewer.
                </p>
            )}
            <div>
                {history.map((item) => (
                    <UpdateButton key={item.name} item={item} />
                ))}
            </div>
        </div>
    )
}

function getClassNames(props: SpontaneousUpdatesViewProps): string {
    const classNames = ["custom", "view-SpontaneousUpdatesView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}
