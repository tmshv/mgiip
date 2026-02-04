import { useMemo } from "react";
import { Layer, Source } from "react-map-gl/mapbox";
import type { LayerProps } from "react-map-gl/mapbox";

export type DatasetLayerProps = {
    id: number;
    clusterProperty: string;
};

export default function DatasetLayer({ id, clusterProperty }: DatasetLayerProps) {
    const clusterProperties = useMemo(() => ({
        sum: ["+", ["get", clusterProperty]],
    }), [clusterProperty]);

    const clusterLayer: LayerProps = useMemo(() => ({
        id: `clusters-${id}`,
        type: "circle",
        filter: ["has", "point_count"],
        paint: {
            "circle-color": "#111111",
            "circle-stroke-width": 2,
            "circle-stroke-color": "#eeeeee",
            "circle-radius": [
                "interpolate",
                ["linear"],
                ["get", "sum"],
                0, 8,
                10, 12,
                50, 18,
                100, 24,
                500, 32,
                1000, 40,
            ],
        },
    }), [id]);

    const clusterCountLayer: LayerProps = useMemo(() => ({
        id: `cluster-count-${id}`,
        type: "symbol",
        filter: ["has", "point_count"],
        paint: {
            "text-color": "#ffffff",
        },
        layout: {
            "text-field": ["get", "sum"],
            "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
            "text-size": 12,
        },
    }), [id]);

    const unclusteredPointLayer: LayerProps = useMemo(() => ({
        id: `unclustered-point-${id}`,
        type: "circle",
        filter: ["!", ["has", "point_count"]],
        paint: {
            "circle-radius": 5,
            "circle-color": "#111111",
            "circle-stroke-width": 2,
            "circle-stroke-color": "#eeeeee",
        },
    }), [id]);

    const unclusteredPointLabelLayer: LayerProps = useMemo(() => ({
        id: `unclustered-point-label-${id}`,
        type: "symbol",
        filter: ["!", ["has", "point_count"]],
        layout: {
            "text-field": ["get", "нп"],
            "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
            "text-size": 12,
            "text-anchor": "left",
            "text-offset": [0.8, 0],
        },
        paint: {
            "text-color": "#333333",
            "text-halo-color": "#ffffff",
            "text-halo-width": 1,
        },
    }), [id]);

    return (
        <Source
            id={`dataset-${id}`}
            type="geojson"
            data={`/dataset${id}.geojson`}
            cluster={true}
            clusterMaxZoom={14}
            clusterRadius={50}
            clusterProperties={clusterProperties}
        >
            <Layer {...clusterLayer} />
            <Layer {...clusterCountLayer} />
            <Layer {...unclusteredPointLayer} />
            <Layer {...unclusteredPointLabelLayer} />
        </Source>
    );
}
