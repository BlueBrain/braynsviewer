import * as React from "react"
import EntryPointsServiceInterface from "../../../contract/service/entry-points"
import Input from "../../../ui/view/input/text"
import Runnable from "../../runnable/runnable-view"
import EntryPointButton from "./entry-point-button"
import "./list-view.css"

export interface ListViewProps {
    className?: string
    service: EntryPointsServiceInterface
    onClick(entryPoint: string): void
}

export default function ListView(props: ListViewProps) {
    const [loading, entryPoints] = useEntryPoints(props.service)
    const [filter, setFilter] = React.useState("")
    const filteredEntryPoints: string[] = filterEntryPoints(filter, entryPoints)
    return (
        <Runnable className={getClassNames(props)} running={loading}>
            <Input
                label={`Filter (${filteredEntryPoints.length} / ${entryPoints.length})`}
                wide={true}
                value={filter}
                onChange={setFilter}
            />
            <div className="list">
                {filteredEntryPoints.map(name => (
                    <EntryPointButton
                        key={name}
                        onClick={() => props.onClick(name)}
                        name={name}
                        service={props.service}
                    />
                ))}
            </div>
        </Runnable>
    )
}

function getClassNames(props: ListViewProps): string {
    const classNames = ["custom", "view-entryPoints-ListView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}

function useEntryPoints(
    service: EntryPointsServiceInterface
): [loading: boolean, entryPoints: string[]] {
    const [loading, setLoading] = React.useState(true)
    const [entryPoints, setEntryPoints] = React.useState<string[]>([])
    React.useEffect(() => {
        setLoading(true)
        try {
            service.listAvailableEntryPoints().then(list => {
                setEntryPoints(list)
                setLoading(false)
            })
        } catch (ex) {
            setLoading(false)
        }
    }, [service])
    return [loading, entryPoints]
}

function filterEntryPoints(filter: string, entryPoints: string[]): string[] {
    const cleanFilter = filter.trim().toLowerCase()
    if (cleanFilter.length === 0) return entryPoints

    const filters = cleanFilter.split(" ").filter(item => item.length > 0)
    return entryPoints.filter(item => {
        const cleanItem = item.toLowerCase()
        for (const filterPart of filters) {
            if (!cleanItem.includes(filterPart)) return false
        }
        return true
    })
}
