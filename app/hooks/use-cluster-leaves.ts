import type { GeoJSONSource } from "mapbox-gl"
import { useEffect, useState } from "react"
import { useMap } from "react-map-gl/mapbox"

export type ClusterLeaf = {
    name: string
    type: string
    region: string
    population: number
}

const MAX_LEAVES = 10

export type ClusterLeavesKeys = {
    cityNameKey: string
    cityTypeKey: string
    regionKey: string
    populationKey: string
}

export function useClusterLeaves(source: string | null, clusterId: number | null, totalCount: number, keys: ClusterLeavesKeys): { leaves: ClusterLeaf[]; loading: boolean } {
    const [leaves, setLeaves] = useState<ClusterLeaf[]>([])
    const [loading, setLoading] = useState(false)
    const { current } = useMap()

    // biome-ignore lint/correctness/useExhaustiveDependencies: totalCount triggers re-fetch when cluster composition changes
    useEffect(() => {
        if (!current || !source || clusterId === null) {
            setLeaves([])
            setLoading(false)
            return
        }

        let cancelled = false
        setLoading(true)

        const map = current.getMap()
        const src = map.getSource(source) as GeoJSONSource | undefined
        if (!src) {
            setLoading(false)
            return
        }

        src.getClusterLeaves(clusterId, MAX_LEAVES, 0, (err, features) => {
            if (cancelled) return
            if (err || !features) {
                setLeaves([])
                setLoading(false)
                return
            }

            const result: ClusterLeaf[] = features
                .map((f) => ({
                    name: (f.properties?.[keys.cityNameKey] as string) ?? "",
                    type: (f.properties?.[keys.cityTypeKey] as string) ?? "",
                    region: (f.properties?.[keys.regionKey] as string) ?? "",
                    population: Number(f.properties?.[keys.populationKey]) || 0,
                }))
                .sort((a, b) => b.population - a.population)

            setLeaves(result)
            setLoading(false)
        })

        return () => {
            cancelled = true
        }
    }, [current, source, clusterId, totalCount, keys.cityNameKey, keys.cityTypeKey, keys.regionKey, keys.populationKey])

    return { leaves, loading }
}
