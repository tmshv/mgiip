import type { GeoJSONFeature } from "mapbox-gl"
import { useEffect, useState } from "react"
import type { MapMouseEvent } from "react-map-gl/mapbox"
import { useMap } from "react-map-gl/mapbox"

export type HoverFeature = {
    coord: GeoJSON.Position
    properties: GeoJSON.GeoJsonProperties
    source: string | null
    clusterId: number | null
}

export function useMapHover(layerNames: string[]): {
    feature: HoverFeature | null
    clear: () => void
} {
    const [feature, setFeature] = useState<HoverFeature | null>(null)
    const { current } = useMap()

    useEffect(() => {
        if (!current) {
            return
        }
        const map = current.getMap()

        const show = (event: MapMouseEvent) => {
            if (!event.features?.length) {
                return
            }
            const f = event.features[0]
            if (!f.properties) {
                return
            }
            const geom = f.geometry as GeoJSON.Point
            const source = (f as GeoJSONFeature).source
            const clusterId = f.properties?.cluster_id as number | undefined
            setFeature({
                coord: geom.coordinates,
                properties: f.properties,
                source: source ?? null,
                clusterId: clusterId ?? null,
            })
        }

        const hide = () => {
            setFeature(null)
        }

        map.on("mouseover", layerNames, show)
        map.on("mouseleave", layerNames, hide)

        return () => {
            map.off("mouseover", layerNames, show)
            map.off("mouseleave", layerNames, hide)
        }
    }, [current, layerNames])

    const clear = () => setFeature(null)

    return { feature, clear }
}
