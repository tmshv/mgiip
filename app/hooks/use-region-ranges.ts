import { useEffect, useState } from "react"

export function computeMaxRanges(geojson: { features: Array<{ properties?: Record<string, unknown> | null }> }): Record<string, number> {
    const maxValues: Record<string, number> = {}
    for (const feature of geojson.features) {
        const props = feature.properties
        if (!props) continue
        for (const [key, value] of Object.entries(props)) {
            if (typeof value !== "number") continue
            if (maxValues[key] === undefined || value > maxValues[key]) {
                maxValues[key] = value
            }
        }
    }
    return maxValues
}

export function useRegionRanges(url: string): Record<string, number> | null {
    const [ranges, setRanges] = useState<Record<string, number> | null>(null)

    useEffect(() => {
        let cancelled = false

        fetch(url)
            .then((res) => res.json())
            .then((geojson) => {
                if (cancelled) return
                setRanges(computeMaxRanges(geojson))
            })

        return () => {
            cancelled = true
        }
    }, [url])

    return ranges
}
