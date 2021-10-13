import * as React from "react"
import Detail from "./detail"
import EntryPointsServiceInterface from "@/contract/service/entry-points"
import List from "./list"
import "./entry-points-view.css"

export interface EntryPointsViewProps {
    className?: string
    service: EntryPointsServiceInterface
}

const STEP_LIST = "list"
const STEP_DETAIL = "detail"

export default function EntryPointsView(props: EntryPointsViewProps) {
    const [entryPointName, setEntryPointName] = React.useState("")
    return (
        <div className={getClassNames(props)}>
            <List service={props.service} onClick={setEntryPointName} />
            <Detail service={props.service} entryPointName={entryPointName} />
        </div>
    )
}

function getClassNames(props: EntryPointsViewProps): string {
    const classNames = ["custom", "view-EntryPointsView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}
