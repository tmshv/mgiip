import { useMemo } from "react"
import type { LayerProps } from "react-map-gl/mapbox"
import { Layer, Source } from "react-map-gl/mapbox"

export type HeatmapColorScheme = "red" | "green" | "blue"

const colorStops: Record<HeatmapColorScheme, string[]> = {
    red: ["rgba(255,245,240,0)", "rgb(254,224,210)", "rgb(252,146,114)", "rgb(251,106,74)", "rgb(222,45,38)", "rgb(165,15,21)"],
    green: ["rgba(247,252,245,0)", "rgb(199,233,192)", "rgb(116,196,118)", "rgb(49,163,84)", "rgb(0,109,44)", "rgb(0,68,27)"],
    blue: ["rgba(33,102,172,0)", "rgb(103,169,207)", "rgb(209,229,240)", "rgb(253,219,199)", "rgb(239,138,98)", "rgb(178,24,43)"],
}

export type HeatmapLayerProps = {
    heatmapProperty: string
    colorScheme: HeatmapColorScheme
    visible: boolean
}

export default function HeatmapLayer({ heatmapProperty, colorScheme, visible }: HeatmapLayerProps) {
    const visibility = visible ? "visible" : "none"
    const stops = colorStops[colorScheme]

    const heatmapLayer: LayerProps = useMemo(
        () => ({
            id: "heatmap",
            type: "heatmap",
            layout: { visibility },
            paint: {
                "heatmap-weight": ["interpolate", ["linear"], ["get", heatmapProperty], 0, 0, 1, 1],
                "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 2, 1, 5, 3, 9, 6],
                "heatmap-color": ["interpolate", ["linear"], ["heatmap-density"], 0, stops[0], 0.2, stops[1], 0.4, stops[2], 0.6, stops[3], 0.8, stops[4], 1, stops[5]],
                "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 2, 20, 5, 40, 9, 60],
                "heatmap-opacity": 0.8,
            },
        }),
        [heatmapProperty, stops, visibility],
    )

    return (
        <Source id="heatmap-source" type="geojson" data="/dataset.geojson">
            <Layer {...heatmapLayer} />
        </Source>
    )
}
