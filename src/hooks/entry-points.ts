import React from "react"

import EntryPointsServiceInterface, {
    EntryPointSchema,
} from "@/contract/service/entry-points"
import { useDebouncedEffect } from "@/ui/hook"

export function useEntryPoints(
    service: EntryPointsServiceInterface
): string[] | undefined | null {
    const [entryPoints, setEntryPoints] = React.useState<
        string[] | undefined | null
    >(undefined)
    React.useEffect(() => {
        setEntryPoints(undefined)
        service
            .listAvailableEntryPoints()
            .then(setEntryPoints)
            .catch((ex) => {
                setEntryPoints(null)
                console.error(ex)
            })
    }, [service])
    return entryPoints
}

export interface EntryPointsHierarchy {
    [entrypointName: string]: EntryPointSchema
}

export function useEntryPointsHierarchy(service: EntryPointsServiceInterface) {
    const [hierarchy, setHierarchy] = React.useState<EntryPointsHierarchy>({})
    const names = useEntryPoints(service)
    useDebouncedEffect(
        () => {
            const action = async () => {
                if (!names) return

                setHierarchy({})
                const result: EntryPointsHierarchy = {}
                for (const name of names) {
                    const schema = await service.getEntryPointSchema(name)
                    result[name] = schema
                }
                setHierarchy(result)
            }
            void action()
        },
        300,
        [service, names]
    )
    return hierarchy
}
