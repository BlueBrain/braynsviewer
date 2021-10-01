import Modal from "@/ui/modal"
import React from "react"

export async function confirmLock(): Promise<boolean> {
    await Modal.info("Your viewport is now locked.")
    return true
}

export async function confirmUnlock(): Promise<boolean> {
    return await Modal.confirm({
        title: "Unlock the Viewport",
        content: (
            <div style={{ width: "640px" }}>
                <p>
                    You are about to <b>unlock</b> the viewport.
                </p>
                <p>
                    Once unlocked, you will be able to move/rotate the camera
                    with gestures. And the resolution of rendered images will be
                    set accordingly to your screen resolution.
                </p>
                <p>
                    Please don't do this if there is currently a movie in
                    process.
                </p>
            </div>
        ),
    })
}
