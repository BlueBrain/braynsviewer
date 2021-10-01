import AppView from "./view/app"
import Modal from "./ui/modal"
import React from "react"
import ReactDOM from "react-dom"
import Theme from "./ui/theme"
import "./index.css"
import {
    makeBraynsService,
    makeConfigManager,
    makeEntryPointsService,
} from "./factory/global"

void start()

async function start() {
    Theme.apply(Theme.defaultDarkTheme)
    const configManager = makeConfigManager()
    const braynsAddress = await configManager.getBraynsAddress()

    try {
        const brayns = makeBraynsService(braynsAddress)
        brayns.debug = /stream/ // false
        await Modal.wait("Connecting Brayns Service...", brayns.connect())

        // Entry point for our app
        const root = document.getElementById("root") as HTMLElement
        ReactDOM.render(
            <AppView
                address={braynsAddress}
                braynsService={brayns}
                entryPointsService={makeEntryPointsService(braynsAddress)}
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

/**
 * We start by looking at the main view so we don't need a real implementation
 * of the info service. SOLID approach allows you to use mocks to code in a
 * more isolated way.
 */
class FakeInfoService implements InfoServiceInterface {
    readonly eventChange = new TriggerableEvent<InfoServiceInterface>()
    framesPerSecond= 666
    memoryUsage= 123
    version= {
            major: 2,
            minor: 0,
            patch: 0,
            revision: "beta",
    }

    constructor() {
        this.update()
    }

    private update = () => {
        window.setTimeout(this.update, 1000 + Math.random() * 4000)
        this.framesPerSecond = Math.floor(Math.random() * 1000)
        this.memoryUsage =
            Math.floor(
                Math.random() * Math.random() * Math.random() * 10000000000
            ) * 1024
        this.eventChange.trigger(this)
    }
}