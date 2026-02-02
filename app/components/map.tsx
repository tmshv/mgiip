import { useCallback, useRef } from "react";
import type { LayerProps, MapRef, MapMouseEvent } from "react-map-gl/mapbox";
import { Layer, Map as MapGl, Source } from "react-map-gl/mapbox";
import type { GeoJSONSource } from "mapbox-gl";
import MapPopup from "./map-popup";

export type MapProps = {
    clusterProperty: string;
};

const clusterLayer: LayerProps = {
    id: "clusters",
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
};

const clusterCountLayer: LayerProps = {
    id: "cluster-count",
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
};

const unclusteredPointLayer: LayerProps = {
    id: "unclustered-point",
    type: "circle",
    filter: ["!", ["has", "point_count"]],
    paint: {
        "circle-radius": 5,
        "circle-color": "#111111",
        "circle-stroke-width": 2,
        "circle-stroke-color": "#eeeeee",
    },
};

const unclusteredPointLabelLayer: LayerProps = {
    id: "unclustered-point-label",
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
};

const Map: React.FC<MapProps> = ({ clusterProperty }) => {
    const mapboxAccessToken = import.meta.env.VITE_MAPBOX_ACCESS_KEY;
    const mapRef = useRef<MapRef>(null);

    const handleClusterClick = useCallback((e: MapMouseEvent) => {
        const map = mapRef.current;
        if (!map) return;

        const features = map.queryRenderedFeatures(e.point, {
            layers: ["clusters"],
        });

        if (!features.length) return;

        const clusterId = features[0].properties?.cluster_id;
        if (clusterId === undefined) return;

        const source = map.getSource("dataset") as GeoJSONSource;
        source.getClusterExpansionZoom(clusterId, (err, zoom) => {
            if (err || zoom === undefined) return;

            const geometry = features[0].geometry;
            if (geometry.type !== "Point") return;

            map.easeTo({
                center: geometry.coordinates as [number, number],
                zoom: zoom,
            });
        });
    }, []);

    return (
        <MapGl
            ref={mapRef}
            onClick={handleClusterClick}
            hash={true}
            initialViewState={{
                longitude: 96.734667,
                latitude: 68.280744,
                zoom: 2.012179,
            }}
            style={{
                width: "100%",
                height: "100%",
            }}
            mapStyle="mapbox://styles/tmshv/cld4aqnw8000e01qwdzz15s6s"
            mapboxAccessToken={mapboxAccessToken}
            minZoom={2}
            projection={"mercator"}
            interactiveLayerIds={["clusters"]}
        >
            <Source
                id="dataset"
                type="geojson"
                data="/dataset.geojson"
                cluster={true}
                clusterMaxZoom={14}
                clusterRadius={50}
                clusterProperties={{
                    sum: ["+", ["get", clusterProperty]],
                }}
            >
                <Layer {...clusterLayer} />
                <Layer {...clusterCountLayer} />
                <Layer {...unclusteredPointLayer} />
                <Layer {...unclusteredPointLabelLayer} />
            </Source>
            <MapPopup layerName={"unclustered-point"} />
        </MapGl>
    );
}

export default Map
