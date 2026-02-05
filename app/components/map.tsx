import { useCallback, useMemo, useRef } from "react";
import type { MapRef, MapMouseEvent } from "react-map-gl/mapbox";
import { Map as MapGl } from "react-map-gl/mapbox";
import type { GeoJSONSource } from "mapbox-gl";
import MapPopup from "./map-popup";
import ClusterPopup from "./cluster-popup";
import DatasetLayer from "./dataset-layer";
import RegionLayer from "./region-layer";
import MapLayerHoverable from "./map-layer-hoverable";
import RainbowLayer from "./rainbow-layer";
import AuroraLayer from "./aurora-layer";
import BirdLayer from "./bird-layer";

export type MapProps = {
    labelProperty: string;
    showRegions: boolean;
};

const DATASET_COUNT = 89;

const Map: React.FC<MapProps> = ({ labelProperty, showRegions }: MapProps) => {
    const mapboxAccessToken = import.meta.env.VITE_MAPBOX_ACCESS_KEY;
    const mapStyle = import.meta.env.VITE_MAPBOX_STYLE;
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
            mapStyle={mapStyle}
            mapboxAccessToken={mapboxAccessToken}
            minZoom={2}
            projection={"mercator"}
            interactiveLayerIds={showRegions ? [] : clusterLayerIds}
        >
            {/*{showRegions && <MapLayerHoverable />}*/}

            {showRegions ? (
                <RegionLayer labelProperty={labelProperty} />
            ) : (
                <>
                    {Array.from({ length: DATASET_COUNT }, (_, i) => i + 1).map(id => (
                        <DatasetLayer key={id} id={id} labelProperty={labelProperty} />
                    ))}
                    <ClusterPopup layerNames={clusterLayerIds} />
                    <MapPopup
                        layerNames={unclusteredPointLayerIds}
                        cityTypeKey="тип"
                        cityNameKey="нп"
                        onpKey="онп"
                        regionKey="регион"
                        districtKey="федеральный округ"
                        populationKey="население"
                    />
                </>
            )}
            <AuroraLayer />
            <RainbowLayer />
            <BirdLayer />
        </MapGl>
    );
}

export default Map
