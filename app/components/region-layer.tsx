import { useMemo } from "react"
import type { LayerProps } from "react-map-gl/mapbox"
import { Layer, Source } from "react-map-gl/mapbox"

const RANGES: Record<string, number> = {
    "количество городов-участников конкурса": 75,
    "количество ОНП": 65,
    "итого подано заявок": 115,
    победители: 55,
    байес: 75,
    "Оптимальность участия (доля побед)": 100,
}

export type RegionLayerProps = {
    regionProperty: string
    visible: boolean
}

export default function RegionLayer({ regionProperty, visible }: RegionLayerProps) {
    const max = RANGES[regionProperty] ?? 100
    const visibility = visible ? "visible" : "none"

    const fillLayer: LayerProps = useMemo(
        () => ({
            id: "regions-fill",
            type: "fill",
            layout: { visibility },
            paint: {
                "fill-color": ["interpolate", ["linear"], ["get", regionProperty], 0, "#eff3ff", max * 0.1, "#bdc9e1", max * 0.25, "#74a9cf", max * 0.5, "#2171b5", max, "#08306b"],
                "fill-opacity": 0.65,
            },
        }),
        [regionProperty, max, visibility],
    )

    const outlineLayer: LayerProps = useMemo(
        () => ({
            id: "regions-outline",
            type: "line",
            layout: { visibility },
            paint: {
                "line-color": "#ffffff",
                "line-width": 1,
            },
        }),
        [visibility],
    )

    const labelLayer: LayerProps = useMemo(
        () => ({
            id: "regions-label",
            type: "symbol",
            layout: {
                visibility,
                "text-field": ["get", "регион"],
                "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
                "text-size": 11,
                "text-transform": "uppercase",
            },
            paint: {
                "text-color": "#999999",
                "text-halo-color": "#eeeeee",
                "text-halo-width": 2,
            },
        }),
        [visibility],
    )

    return (
        <>
            <Source id="dataset-regions" type="geojson" data="/dataset-regions.geojson">
                <Layer {...fillLayer} />
                <Layer {...outlineLayer} />
            </Source>
            <Source id="dataset-regions-points" type="geojson" data="/dataset-regions-point.geojson">
                <Layer {...labelLayer} />
            </Source>
        </>
    )
}
