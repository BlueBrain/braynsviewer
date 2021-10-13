import * as React from "react"
import EntryPointsServiceInterface from "../../contract/service/entry-points"
import Wizard from "../../ui/view/wizard"
import Detail from "./detail"
import "./entry-points-view.css"
import List from "./list"

export interface EntryPointsViewProps {
    className?: string
    service: EntryPointsServiceInterface
}

const STEP_LIST = "list"
const STEP_DETAIL = "detail"

export default function EntryPointsView(props: EntryPointsViewProps) {
    const [entryPointName, setEntryPointName] = React.useState("")
    const handleEntryPointClick = async (name: string) => {
        setEntryPointName(name)
        setStep(STEP_DETAIL)
    }
    const [step, setStep] = React.useState(STEP_LIST)
    return (
        <Wizard step={step} className={getClassNames(props)}>
            <List
                key={STEP_LIST}
                service={props.service}
                onClick={handleEntryPointClick}
            />
            <Detail
                key={STEP_DETAIL}
                service={props.service}
                entryPointName={entryPointName}
                onBack={() => setStep(STEP_LIST)}
            />
        </Wizard>
    )
}

function getClassNames(props: EntryPointsViewProps): string {
    const classNames = ["custom", "view-EntryPointsView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}
