import { LoaderDefinition } from "@/contract/service/loaders"
import * as React from "react"

/**
 * Sorted list of extensions names used in all available loaders.
 */
export function useExtensions(loaders: LoaderDefinition[]): string[] {
    const [extensions, setExtensions] = React.useState<string[]>([])
    React.useEffect(() => {
        const extensionsSet = new Set<string>()
        for (const loader of loaders) {
            for (const ext of loader.extensions) {
                extensionsSet.add(ext)
            }
        }
        const uniqueExtensions: string[] = Array.from(extensionsSet)
        uniqueExtensions.sort()
        setExtensions(uniqueExtensions)
    }, [loaders])
    return extensions
}
