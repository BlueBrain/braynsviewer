import * as React from "react"

import { useEntryPoints } from "@/hooks/entry-points"
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
    const entryPoints = useEntryPoints(props.service)
    const [filter, setFilter] = React.useState("")
    const filteredEntryPoints: string[] = filterEntryPoints(filter, entryPoints)
    return (
        <Runnable className={getClassNames(props)} running={!entryPoints}>
            <Input
                label={`Filter (${filteredEntryPoints.length} / ${
                    (entryPoints ?? []).length
                })`}
                wide={true}
                value={filter}
                onChange={setFilter}
            />
            <div className="list">
                {filteredEntryPoints.map((name) => (
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

function filterEntryPoints(
    filter: string,
    entryPoints: string[] | undefined | null
): string[] {
    if (!entryPoints) return []

    const cleanFilter = filter.trim().toLowerCase()
    if (cleanFilter.length === 0) return entryPoints

    const filters = cleanFilter.split(" ").filter((item) => item.length > 0)
    return entryPoints.filter((item) => {
        const cleanItem = item.toLowerCase()
        for (const filterPart of filters) {
            if (!cleanItem.includes(filterPart)) return false
        }
        return true
    })
}
