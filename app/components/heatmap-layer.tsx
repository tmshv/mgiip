import { useMemo } from "react"
import type { LayerProps } from "react-map-gl/mapbox"
import { Layer, Source } from "react-map-gl/mapbox"

export type HeatmapLayerProps = {
    heatmapProperty: string
    visible: boolean
}

export default function HeatmapLayer({ heatmapProperty, visible }: HeatmapLayerProps) {
    const visibility = visible ? "visible" : "none"

    const heatmapLayer: LayerProps = useMemo(
        () => ({
            id: "heatmap",
            type: "heatmap",
            layout: { visibility },
            paint: {
                "heatmap-weight": ["interpolate", ["linear"], ["get", heatmapProperty], 0, 0, 1, 1],
                "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 2, 1, 5, 3, 9, 6],
                "heatmap-color": [
                    "interpolate",
                    ["linear"],
                    ["heatmap-density"],
                    0,
                    "rgba(33,102,172,0)",
                    0.2,
                    "rgb(103,169,207)",
                    0.4,
                    "rgb(209,229,240)",
                    0.6,
                    "rgb(253,219,199)",
                    0.8,
                    "rgb(239,138,98)",
                    1,
                    "rgb(178,24,43)",
                ],
                "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 2, 20, 5, 40, 9, 60],
                "heatmap-opacity": 0.8,
            },
        }),
        [heatmapProperty, visibility],
    )

    return (
        <Source id="heatmap-source" type="geojson" data="/dataset.geojson">
            <Layer {...heatmapLayer} />
        </Source>
    )
}
