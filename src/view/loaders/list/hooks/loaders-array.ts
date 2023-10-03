import LoadersServiceInterface, {
    LoaderDefinition,
} from "@/contract/service/loaders"
import * as React from "react"

/**
 * Asychronously get the list of available loaders.
 */
export function useLoadersArray(
    service: LoadersServiceInterface,
    setBusy: (value: boolean) => void
): LoaderDefinition[] {
    const [loaders, setLoaders] = React.useState<LoaderDefinition[]>([])
    React.useEffect(() => {
        const later = async () => {
            setBusy(true)
            try {
                setLoaders(await service.listAvailableLoaders())
            } finally {
                setBusy(false)
            }
        }
        void later()
    }, [service, setBusy])
    return loaders
}
