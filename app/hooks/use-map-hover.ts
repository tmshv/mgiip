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

export type UseMapHoverOptions = {
    followCursor?: boolean
}

export function useMapHover(
    layerNames: string[],
    options?: UseMapHoverOptions,
): {
    feature: HoverFeature | null
    clear: () => void
} {
    const followCursor = options?.followCursor ?? false
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
            const geom = f.geometry
            const coord = geom.type === "Point" ? (geom as GeoJSON.Point).coordinates : [event.lngLat.lng, event.lngLat.lat]
            const source = (f as GeoJSONFeature).source
            const clusterId = f.properties?.cluster_id as number | undefined
            setFeature({
                coord,
                properties: f.properties,
                source: source ?? null,
                clusterId: clusterId ?? null,
            })
        }

        const hide = () => {
            setFeature(null)
        }

        const enterEvent = followCursor ? "mousemove" : "mouseover"
        map.on(enterEvent, layerNames, show)
        map.on("mouseleave", layerNames, hide)

        return () => {
            map.off(enterEvent, layerNames, show)
            map.off("mouseleave", layerNames, hide)
        }
    }, [current, layerNames, followCursor])

    const clear = () => setFeature(null)

    return { feature, clear }
}
