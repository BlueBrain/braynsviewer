import React from "react"
import ConfigManagerInterface from "../../contract/manager/config"
import Modal from "../../ui/modal"
import BraynsAddressInputView from "./brayns-address-input"
import { BraynsAddress } from "./types"

export default class ConfigManager implements ConfigManagerInterface {
    async getBraynsAddress(): Promise<BraynsAddress> {
        const params = new URLSearchParams(window.location.search)
        const hostParam = params.get("host")
        if (hostParam) {
            const [host, portText] = hostParam.split(":")
            const port = parseInt(portText, 10)
            return { host, port }
        }

        return new Promise<BraynsAddress>((resolve) => {
            const modal = new Modal({ align: "B", padding: "3rem" })
            modal.show(
                <BraynsAddressInputView
                    onClick={(address) => {
                        modal.hide()
                        const params = new URLSearchParams(
                            window.location.search
                        )
                        params.set("host", `${address.host}:${address.port}`)
                        window.location.search = `?${params.toString()}`
                        resolve(address)
                    }}
                />
            )
        })
    }
}
