import React from "react"
import Modal from "../../../ui/modal"
import Checkbox from "../../../ui/view/checkbox"
import Dialog from "../../../ui/view/dialog"

export default async function SelectCamera(
    currentType: string,
    availableTypes: string[]
): Promise<null | string> {
    return new Promise((resolve) => {
        const modal = new Modal({ align: "TL" })
        modal.show(
            <TypesListDialog
                type={currentType}
                types={availableTypes}
                onSelect={(v) => {
                    modal.hide()
                    resolve(v)
                }}
            />
        )
    })
}

interface TypesListDialogProps {
    type: string
    types: string[]
    onSelect(this: void, type: string | null): void
}

function TypesListDialog(props: TypesListDialogProps) {
    const { types, onSelect } = props
    const [current, setCurrent] = React.useState(props.type)
    const handleClick = (typeName: string, selected: boolean) => {
        if (!selected) return
        setCurrent(typeName)
    }
    return (
        <Dialog
            title="Select current camera type"
            labelOK="Apply"
            colorOK="accent"
            valid={props.type !== current}
            onCancel={() => onSelect(null)}
            onOK={() => onSelect(current)}
        >
            {types.map((type) => (
                <Checkbox
                    key={type}
                    label={type}
                    wide={true}
                    value={type === current}
                    onChange={(v) => handleClick(type, v)}
                />
            ))}
        </Dialog>
    )
}
