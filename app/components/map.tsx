import type { GeoJSONFeature, GeoJSONSource } from "mapbox-gl"
import { useCallback, useMemo, useRef } from "react"
import type { MapMouseEvent, MapRef } from "react-map-gl/mapbox"
import { Map as MapGl } from "react-map-gl/mapbox"
import type { FieldKeys } from "~/types/fields"
import ClusterPopup from "./cluster-popup"
import DatasetLayer from "./dataset-layer"
import MapPopup from "./map-popup"
import RegionLayer from "./region-layer"
import RegionPopup from "./region-popup"
import SearchOverlay from "./search-overlay"

export type MapProps = {
    cityLabelProperty: string
    showCities: boolean
    showRegions: boolean
    regionProperty: string
    fields: FieldKeys
}

const DATASET_COUNT = 89

const AppMap: React.FC<MapProps> = ({ cityLabelProperty, showCities, showRegions, regionProperty, fields }: MapProps) => {
    const mapboxAccessToken = import.meta.env.VITE_MAPBOX_ACCESS_KEY
    const mapStyle = import.meta.env.VITE_MAPBOX_STYLE
    const mapRef = useRef<MapRef>(null)

    const clusterLayerIds = useMemo(() => Array.from({ length: DATASET_COUNT }, (_, i) => `clusters-${i + 1}`), [])

    const unclusteredPointLayerIds = useMemo(() => Array.from({ length: DATASET_COUNT }, (_, i) => `unclustered-point-${i + 1}`), [])

    const handleSearchSelect = useCallback((coordinate: [number, number], zoom: number) => {
        mapRef.current?.flyTo({ center: coordinate, zoom })
    }, [])

    const handleClusterClick = useCallback(
        (e: MapMouseEvent) => {
            const map = mapRef.current
            if (!map) return

            const features = map.queryRenderedFeatures(e.point, {
                layers: clusterLayerIds,
            })

            if (!features.length) return

            const clusterId = features[0].properties?.cluster_id
            if (clusterId === undefined) return

            const sourceId = (features[0] as GeoJSONFeature).source
            if (!sourceId) return
            const source = map.getSource(sourceId) as GeoJSONSource
            source.getClusterExpansionZoom(clusterId, (err, zoom) => {
                if (err || zoom === undefined || zoom === null) return

                const geometry = features[0].geometry
                if (geometry.type !== "Point") return

                map.easeTo({
                    center: geometry.coordinates as [number, number],
                    zoom,
                })
            })
        },
        [clusterLayerIds],
    )

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
            interactiveLayerIds={showCities ? clusterLayerIds : []}
        >
            <SearchOverlay onSelect={handleSearchSelect} />
            <RegionLayer regionProperty={regionProperty} visible={showRegions} />
            {showRegions && <RegionPopup regionProperty={regionProperty} />}
            {Array.from({ length: DATASET_COUNT }, (_, i) => i + 1).map((id) => (
                <DatasetLayer key={id} id={id} labelProperty={cityLabelProperty} cityNameKey={fields.cityName} visible={showCities} />
            ))}
            {showCities && (
                <>
                    <ClusterPopup layerNames={clusterLayerIds} fields={fields} />
                    <MapPopup layerNames={unclusteredPointLayerIds} fields={fields} />
                </>
            )}
        </MapGl>
    )
}

export default AppMap
