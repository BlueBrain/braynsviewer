import * as React from "react"
import InfoServiceInterface from "../../../contract/service/info"

/**
 * Manage updates of fps, memory and version.
 */
export function useStatistics(
    infoService: InfoServiceInterface
): [fps: number, memory: number, version: string] {
    const [version, setVersion] = React.useState("...")
    const [fps, setFps] = React.useState(0)
    const [memory, setMemory] = React.useState(0)
    React.useEffect(() => {
        const handleInfoUpdate = () => {
            const { major, minor, patch, revision } = infoService.version
            setVersion(`${major}.${minor}.${patch} (${revision})`)
            setFps(infoService.framesPerSecond)
            setMemory(infoService.memoryUsage)
        }
        handleInfoUpdate()
        infoService.eventChange.add(handleInfoUpdate)
        return () => infoService.eventChange.remove(handleInfoUpdate)
    }, [infoService])
    return [fps, memory, version]
}
