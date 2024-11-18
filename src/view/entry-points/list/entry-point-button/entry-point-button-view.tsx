import * as React from "react"
import EntryPointsServiceInterface from "../../../../contract/service/entry-points"
import Touchable from "../../../../ui/view/touchable"
import "./entry-point-button-view.css"

export interface EntryPointButtonViewProps {
    className?: string
    service: EntryPointsServiceInterface
    name: string
    onClick(this: void, name: string): void
}

export default function EntryPointButtonView(props: EntryPointButtonViewProps) {
    const { service, name, onClick } = props
    const description = useDescription(service, name)
    return (
        <Touchable
            className={getClassNames(props)}
            onClick={() => onClick(name)}
            title={description}
        >
            <div className="name">{name}</div>
            <div className="doc">{description}</div>
        </Touchable>
    )
}

function getClassNames(props: EntryPointButtonViewProps): string {
    const classNames = ["custom", "view-entryPoints-list-EntryPointButtonView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}

function useDescription(
    service: EntryPointsServiceInterface,
    entryPointName: string
) {
    const [description, setDescription] = React.useState("")
    React.useEffect(() => {
        const asyncFunction = async () => {
            try {
                const schema = await service.getEntryPointSchema(entryPointName)
                setDescription(schema.description)
            } catch (ex) {
                setDescription(`${ex}`)
            }
        }
        void asyncFunction()
    }, [service, entryPointName])
    return description
}
