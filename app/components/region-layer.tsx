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
}

export default function RegionLayer({ regionProperty }: RegionLayerProps) {
    const max = RANGES[regionProperty] ?? 100

    const fillLayer: LayerProps = useMemo(
        () => ({
            id: "regions-fill",
            type: "fill",
            paint: {
                "fill-color": ["interpolate", ["linear"], ["get", regionProperty], 0, "#eff3ff", max * 0.1, "#bdc9e1", max * 0.25, "#74a9cf", max * 0.5, "#2171b5", max, "#08306b"],
                "fill-opacity": 0.65,
            },
        }),
        [regionProperty, max],
    )

    const outlineLayer: LayerProps = useMemo(
        () => ({
            id: "regions-outline",
            type: "line",
            paint: {
                "line-color": "#ffffff",
                "line-width": 1,
            },
        }),
        [],
    )

    const labelLayer: LayerProps = useMemo(
        () => ({
            id: "regions-label",
            type: "symbol",
            layout: {
                "text-field": ["get", "name"],
                "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
                "text-size": 11,
            },
            paint: {
                "text-color": "#333333",
                "text-halo-color": "#ffffff",
                "text-halo-width": 2,
            },
        }),
        [],
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
