import InfoServiceInterface from "@/contract/service/info"
import TriggerableEvent from "@/tool/event"
import React from "react"
import ReactDOM from "react-dom"
import {
    makeBraynsService,
    makeConfigManager,
    makeInfoService
} from "./factory/global"
import "./index.css"
import Modal from "./ui/modal"
import Theme from "./ui/theme"
import AppView from "./view/app"

start()

async function start() {
    Theme.apply(Theme.defaultDarkTheme)
    const configManager = makeConfigManager()
    const braynsAddress = await configManager.getBraynsAddress()

    try {
        const brayns = makeBraynsService(braynsAddress)
        await Modal.wait("Connecting Brayns Service...", brayns.connect())

        // Entry point for our app
        const root = document.getElementById("root") as HTMLElement
        ReactDOM.render(
            <AppView
                address={braynsAddress}
                infoService={makeInfoService(braynsAddress)}
            />,
            root
        )
        removeSplash()
    } catch (ex) {
        await Modal.error(
            <div>
                <h1>Unable to start!</h1>
                {typeof ex === "string" ? (
                    <code>{`${ex}`}</code>
                ) : (
                    <pre>{JSON.stringify(ex, null, "  ")}</pre>
                )}
            </div>
        )
        const params = new URLSearchParams(window.location.search)
        params.delete("host")
        window.location.search = `?${params.toString()}`
    }
}

function removeSplash() {
    const splash = document.getElementById("splash-screen")
    if (splash) {
        splash.classList.add("vanish")
        window.setTimeout(() => document.body.removeChild(splash), 600)
    }
}
