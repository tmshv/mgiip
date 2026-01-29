import type { LayerProps } from "react-map-gl/mapbox";
import { Layer, Map as MapGl, Source } from "react-map-gl/mapbox";
import MapLayerHoverable from "./map-layer-hoverable";
import MapPopup from "./map-popup";

const layerStyleCircle: LayerProps = {
    id: "project-circle",
    type: "circle",
    paint: {
        "circle-radius": 5,
        "circle-color": "#111111",
        "circle-stroke-width": 2,
        "circle-stroke-color": "#eeeeee",
    }
};

const layerStyleFill: LayerProps = {
    id: "project-fill",
    type: "fill",
    paint: {
        "fill-color": "#ee1111",
        "fill-opacity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            12, 0,
            13, 0.35,
        ],
    },
    minzoom: 12,
};

const layerStyleLine: LayerProps = {
    id: "project-line",
    type: "line",
    paint: {
        "line-color": "#ee1111",
        "line-width": 1,
        "line-opacity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            12, 0,
            13, 1,
        ],
    },
    minzoom: 12,
};

const layerStyleSymbol: LayerProps = {
    id: "place-name",
    type: "symbol",
    paint: {
        "text-color": "#000000",
        "text-halo-color": "#ffffff",
        "text-halo-width": 4,
        "text-translate": [10, 0],
    },
    layout: {
        "text-field": ["get", "name"],
        "text-size": 10,
        "text-anchor": "left",
    },
};

const Map: React.FC = () => {
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
            // mapStyle="mapbox://styles/mapbox/standard"
            mapboxAccessToken={mapboxAccessToken}
            minZoom={2}
            projection={"mercator"}
        >
            <MapLayerHoverable />
            <Source id="project-boundaries" type="geojson" data="/boundaries.geojson">
                <Layer {...layerStyleFill} />
                <Layer {...layerStyleLine} />
            </Source>
            <Source id="projects" type="geojson" data="/projects.geojson">
                <Layer {...layerStyleCircle} />
            </Source>
            <Source id="places" type="geojson" data="/places.geojson">
                <Layer {...layerStyleSymbol} />
            </Source>
            <MapPopup layerName={"project-circle"} />
        </MapGl>
    );
}

export default Map
