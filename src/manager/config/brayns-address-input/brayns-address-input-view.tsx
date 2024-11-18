import * as React from "react"
import TextInput from "../../../ui/view/input/text"
import Dialog from "../../../ui/view/dialog"
import { BraynsAddress } from "../types"

export interface BraynsAddressInputViewProps {
    className?: string
    onClick(address: BraynsAddress): void
}

export default function BraynsAddressInputView(
    props: BraynsAddressInputViewProps
) {
    const [value, setValue] = React.useState("")
    const [valid, setValid] = React.useState(false)

    return (
        <Dialog
            hideCancel={true}
            valid={valid}
            title="Connection"
            onOK={() => props.onClick(makeAddress(value))}
        >
            <TextInput
                value={value}
                wide={true}
                label="Brayns service host and port"
                onChange={(v) => {
                    setValue(v)
                    setValid(isValid(v))
                }}
                onEnterPressed={(v) => {
                    if (isValid(v)) props.onClick(makeAddress(v))
                }}
            />
            <p>
                Here is an example of Brayns service address:
                <br />
                <code>r1i4n1.bbp.epfl.ch:5104</code>
            </p>
        </Dialog>
    )
}

function makeAddress(value: string): BraynsAddress {
    const [host, port] = value.split(":")
    return {
        host,
        port: parseInt(port, 10),
    }
}

const RX_ADDRESS = /^[^: \t\n\r]+:[0-9]+$/gi

function isValid(text: string) {
    RX_ADDRESS.lastIndex = -1
    return RX_ADDRESS.test(text)
}
