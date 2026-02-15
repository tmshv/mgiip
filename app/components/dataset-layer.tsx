import { useMemo } from "react"
import type { LayerProps } from "react-map-gl/mapbox"
import { Layer, Source } from "react-map-gl/mapbox"

export type DatasetLayerProps = {
    id: string
    dataUrl: string
    labelProperty: string
    cityNameKey: string
    visible: boolean
}

export default function DatasetLayer({ id, dataUrl, labelProperty, cityNameKey, visible }: DatasetLayerProps) {
    const visibility = visible ? "visible" : "none"

    const clusterProperties = useMemo(
        () => ({
            sum: ["+", ["get", labelProperty]],
        }),
        [labelProperty],
    )

    const clusterLayer: LayerProps = useMemo(
        () => ({
            id: `clusters-${id}`,
            type: "circle",
            filter: ["has", "point_count"],
            layout: { visibility },
            paint: {
                "circle-color": "#111111",
                "circle-stroke-width": 2,
                "circle-stroke-color": "#eeeeee",
                "circle-radius": ["interpolate", ["linear"], ["get", "sum"], 0, 8, 10, 12, 50, 18, 100, 24, 500, 32, 1000, 40],
            },
        }),
        [id, visibility],
    )

    const clusterCountLayer: LayerProps = useMemo(
        () => ({
            id: `cluster-count-${id}`,
            type: "symbol",
            filter: ["has", "point_count"],
            paint: {
                "text-color": "#ffffff",
            },
            layout: {
                visibility,
                "text-field": ["get", "sum"],
                "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
                "text-size": 12,
                "text-allow-overlap": true,
            },
        }),
        [id, visibility],
    )

    const unclusteredPointLayer: LayerProps = useMemo(
        () => ({
            id: `unclustered-point-${id}`,
            type: "circle",
            filter: ["!", ["has", "point_count"]],
            layout: { visibility },
            paint: {
                "circle-radius": 6,
                "circle-color": "#111111",
                "circle-stroke-width": 2,
                "circle-stroke-color": "#eeeeee",
            },
        }),
        [id, visibility],
    )

    // Layer to display the property value as text inside the circle
    const unclusteredPointValueLayer: LayerProps = useMemo(
        () => ({
            id: `unclustered-point-value-${id}`,
            type: "symbol",
            filter: ["!", ["has", "point_count"]],
            layout: {
                visibility,
                "text-field": ["get", labelProperty],
                "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
                "text-size": 10,
                "text-anchor": "center", // Center the text in the circle
                "text-allow-overlap": true,
            },
            paint: {
                "text-color": "#ffffff",
            },
        }),
        [id, labelProperty, visibility],
    )

    // Original label layer to show the name to the side
    const unclusteredPointLabelLayer: LayerProps = useMemo(
        () => ({
            id: `unclustered-point-label-${id}`,
            type: "symbol",
            filter: ["!", ["has", "point_count"]],
            layout: {
                visibility,
                "text-field": ["get", cityNameKey],
                "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
                "text-size": 14,
                "text-anchor": "left",
                "text-offset": [0.8, 0],
            },
            paint: {
                "text-color": "#333333",
                "text-halo-color": "#ffffff",
                "text-halo-width": 1,
            },
        }),
        [id, cityNameKey, visibility],
    )

    return (
        <Source
            key={`dataset-${id}-${labelProperty}`} // Add key to force re-render when labelProperty changes
            id={`dataset-${id}`}
            type="geojson"
            data={dataUrl}
            cluster={true}
            clusterMaxZoom={14}
            clusterRadius={50}
            clusterProperties={clusterProperties}
        >
            <Layer {...clusterLayer} />
            <Layer {...unclusteredPointLayer} />
            {/* Name label to the side */}
            <Layer {...unclusteredPointLabelLayer} />
            {/* Numbers on top: cluster counts and point values */}
            <Layer {...clusterCountLayer} />
            <Layer {...unclusteredPointValueLayer} />
        </Source>
    )
}
