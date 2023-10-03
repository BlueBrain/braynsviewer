import LoadersServiceInterface, {
    LoaderDefinition,
} from "@/contract/service/loaders"
import Button from "@/ui/view/button"
import InputView from "@/ui/view/input/text"
import * as React from "react"
import RunnableView from "../../runnable"
import { useExtensions, useLoadersArray } from "./hooks"
import LoaderButton from "./loader-button"
import "./loaders-list-view.css"

export interface LoadersListViewProps {
    className?: string
    loadersService: LoadersServiceInterface
    onSelect(this: void, loader: LoaderDefinition): void
}

export default function LoadersListView(props: LoadersListViewProps) {
    const [busy, setBusy] = React.useState(false)
    const loaders = useLoadersArray(props.loadersService, setBusy)
    const [extensionFilter, setExtensionFilter] = React.useState("")
    const extensions = useExtensions(loaders)
    const loadersToDisplay = loaders.filter(makeFilter(extensionFilter))
    const filtered = loadersToDisplay.length < loaders.length
    return (
        <RunnableView className={getClassNames(props)} running={busy}>
            <h1>
                Loaders{" "}
                {filtered && `(${loadersToDisplay.length} / ${loaders.length})`}
            </h1>
            <InputView
                wide={true}
                label="Filter by extension"
                value={extensionFilter}
                onChange={setExtensionFilter}
                suggestions={extensions}
            />
            <div>
                {loadersToDisplay.map((loader) => (
                    <LoaderButton
                        key={loader.name}
                        value={loader}
                        onClick={props.onSelect}
                    />
                ))}
            </div>
            {extensionFilter.trim().length > 0 &&
                loadersToDisplay.length === 0 && (
                    <div className="error">
                        No loader can accept such extensions:{" "}
                        <b>{extensionFilter}</b>!
                    </div>
                )}
            {filtered && (
                <>
                    <hr />
                    <Button
                        wide={true}
                        label="Show all available loaders"
                        onClick={() => setExtensionFilter("")}
                    />
                </>
            )}
        </RunnableView>
    )
}

function getClassNames(props: LoadersListViewProps): string {
    const classNames = ["custom", "view-LoadersListView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}

const RX_FILTER_SEPARATOR = /[^0-9a-z_.-]/i

/**
 * If the filter is empty, we display everything.
 * Otherwise, we treat the filter as a string of extensions.
 * We keep the loaders that work with at least one of those extensions.
 * The extensions are matched without taking care of the case.
 */
function makeFilter(filterString: string) {
    const extensions = filterString
        .trim()
        .toLowerCase()
        .split(RX_FILTER_SEPARATOR)
        .filter((item) => item.length > 0)
    if (extensions.length === 0) return () => true
    return (loader: LoaderDefinition) => {
        for (const ext of loader.extensions) {
            if (extensions.includes(ext.toLowerCase())) return true
        }
        return false
    }
}
