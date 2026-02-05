import { useMemo } from "react";
import { Layer, Source } from "react-map-gl/mapbox";
import type { LayerProps } from "react-map-gl/mapbox";

const PROPERTY_MAP: Record<string, string> = {
    "подавался": "applications",
    "победители": "winners",
};

export type RegionLayerProps = {
    labelProperty: string;
};

export default function RegionLayer({ labelProperty }: RegionLayerProps) {
    const dataProperty = PROPERTY_MAP[labelProperty] ?? "winners";

    const fillLayer: LayerProps = useMemo(() => ({
        id: "regions-fill",
        type: "fill",
        paint: {
            "fill-color": [
                "interpolate",
                ["linear"],
                ["get", dataProperty],
                0, "#eff3ff",
                10, "#bdc9e1",
                25, "#74a9cf",
                50, "#2171b5",
                100, "#08306b",
            ],
            "fill-opacity": 0.65,
        },
    }), [dataProperty]);

    const outlineLayer: LayerProps = useMemo(() => ({
        id: "regions-outline",
        type: "line",
        paint: {
            "line-color": "#ffffff",
            "line-width": 1,
        },
    }), []);

    const labelLayer: LayerProps = useMemo(() => ({
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
    }), []);

    return (
        <Source
            id="dataset-regions"
            type="geojson"
            data="/dataset-regions.geojson"
        >
            <Layer {...fillLayer} />
            <Layer {...outlineLayer} />
            <Layer {...labelLayer} />
        </Source>
    );
}
