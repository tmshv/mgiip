import { useEffect, useState } from "react"
import type { FieldKeys } from "~/types/fields"

export type SearchItem = {
    name: string
    tag: string
    coordinate: [number, number]
    zoom: number
}

const DATASET_COUNT = 89

export function useSearchData(fields: FieldKeys) {
    const [items, setItems] = useState<SearchItem[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const urls = Array.from({ length: DATASET_COUNT }, (_, i) => `/dataset${i + 1}.geojson`)
        urls.push("/dataset-regions-point.geojson")

        Promise.all(urls.map((url) => fetch(url).then((r) => r.json())))
            .then((datasets) => {
                const result: SearchItem[] = []
                const seen = new Set<string>()

                for (let i = 0; i < datasets.length; i++) {
                    const fc = datasets[i]
                    const isRegion = i === datasets.length - 1

                    for (const feature of fc.features) {
                        const coords = feature.geometry?.coordinates
                        if (!coords) continue

                        if (isRegion) {
                            const name = feature.properties?.[fields.region]
                            const tag = feature.properties?.[fields.regionDistrict] ?? ""
                            if (name) {
                                result.push({ name, tag, coordinate: [coords[0], coords[1]], zoom: 6 })
                            }
                        } else {
                            const name = feature.properties?.[fields.cityName]
                            const tag = feature.properties?.[fields.region] ?? ""
                            if (name) {
                                const key = `${name}|${tag}`
                                if (!seen.has(key)) {
                                    seen.add(key)
                                    result.push({ name, tag, coordinate: [coords[0], coords[1]], zoom: 10 })
                                }
                            }
                        }
                    }
                }

                setItems(result)
            })
            .finally(() => setLoading(false))
    }, [fields])

    return { items, loading }
}
