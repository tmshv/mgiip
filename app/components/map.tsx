import { useCallback, useMemo, useRef } from "react";
import type { MapRef, MapMouseEvent } from "react-map-gl/mapbox";
import { Map as MapGl } from "react-map-gl/mapbox";
import type { GeoJSONSource } from "mapbox-gl";
import MapPopup from "./map-popup";
import DatasetLayer from "./dataset-layer";

export type MapProps = {
    labelProperty: string;
};

const DATASET_COUNT = 89;

const Map: React.FC<MapProps> = ({ labelProperty }: MapProps) => {
    const mapboxAccessToken = import.meta.env.VITE_MAPBOX_ACCESS_KEY;
    const mapRef = useRef<MapRef>(null);

    const clusterLayerIds = useMemo(
        () => Array.from({ length: DATASET_COUNT }, (_, i) => `clusters-${i + 1}`),
        []
    );

    const unclusteredPointLayerIds = useMemo(
        () => Array.from({ length: DATASET_COUNT }, (_, i) => `unclustered-point-${i + 1}`),
        []
    );

    const handleClusterClick = useCallback((e: MapMouseEvent) => {
        const map = mapRef.current;
        if (!map) return;

        const features = map.queryRenderedFeatures(e.point, {
            layers: clusterLayerIds,
        });

        if (!features.length) return;

        const clusterId = features[0].properties?.cluster_id;
        if (clusterId === undefined) return;

        const sourceId = (features[0] as any).source as string;
        const source = map.getSource(sourceId) as GeoJSONSource;
        source.getClusterExpansionZoom(clusterId, (err, zoom) => {
            if (err || zoom === undefined || zoom === null) return;

            const geometry = features[0].geometry;
            if (geometry.type !== "Point") return;

            map.easeTo({
                center: geometry.coordinates as [number, number],
                zoom,
            });
        });
    }, [clusterLayerIds]);

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
            interactiveLayerIds={clusterLayerIds}
        >
            {Array.from({ length: DATASET_COUNT }, (_, i) => i + 1).map(id => (
                <DatasetLayer key={id} id={id} labelProperty={labelProperty} />
            ))}
            <MapPopup
                layerNames={unclusteredPointLayerIds}
                cityTypeKey="тип"
                cityNameKey="нп"
                onpKey="онп"
                regionKey="регион"
                districtKey="федеральный округ"
                populationKey="население"
            />
        </MapGl>
    );
}

export default Map
