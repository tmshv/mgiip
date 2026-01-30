import type { LayerProps } from "react-map-gl/mapbox";
import { Layer, Map as MapGl, Source } from "react-map-gl/mapbox";
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

const Map: React.FC<MapProps> = ({ clusterProperty }) => {
    const mapboxAccessToken = import.meta.env.VITE_MAPBOX_ACCESS_KEY;

    return (
        <MapGl
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
            </Source>
            <MapPopup layerName={"unclustered-point"} />
        </MapGl>
    );
}

export default Map
