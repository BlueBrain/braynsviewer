import LoadersServiceInterface, {
    LoaderDefinition,
} from "@/contract/service/loaders"
import Wizard from "@/ui/view/wizard"
import * as React from "react"
import LoaderDetail from "./detail"
import LoadersList from "./list"
import "./loaders-view.css"

export interface LoadersViewProps {
    className?: string
    loadersService: LoadersServiceInterface
}

const STEP_LIST = "list"
const STEP_DETAIL = "detail"

export default function LoadersView(props: LoadersViewProps) {
    const { loadersService } = props
    const [selectedLoader, setSelectedLoader] = React.useState<
        LoaderDefinition | undefined
    >(undefined)
    const [step, setStep] = React.useState(STEP_LIST)
    return (
        <Wizard step={step} className={getClassNames(props)}>
            <LoadersList
                key={STEP_LIST}
                loadersService={loadersService}
                onSelect={(loader) => {
                    setSelectedLoader(loader)
                    setStep(STEP_DETAIL)
                }}
            />
            <LoaderDetail
                key={STEP_DETAIL}
                loader={selectedLoader}
                loadersService={loadersService}
                onBack={() => {
                    setStep(STEP_LIST)
                }}
            />
        </Wizard>
    )
}

function getClassNames(props: LoadersViewProps): string {
    const classNames = ["custom", "view-LoadersView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}
