import type { GeoJSONFeature, GeoJSONSource } from "mapbox-gl"
import { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from "react"
import type { MapMouseEvent, MapRef } from "react-map-gl/mapbox"
import { Map as MapGl } from "react-map-gl/mapbox"
import { useRegionRanges } from "~/hooks/use-region-ranges"
import { type DatasetMode, getClusterLayerIds, getDatasets, getUnclusteredLayerIds } from "~/lib/datasets"
import type { FieldKeys } from "~/types/fields"
import ClusterPopup from "./cluster-popup"
import DatasetLayer from "./dataset-layer"
import MapPopup from "./map-popup"
import RegionLayer from "./region-layer"
import RegionPopup from "./region-popup"

export type MapProps = {
    datasetMode: DatasetMode
    datasetCount: number
    cityLabelProperty: string
    showCities: boolean
    showRegions: boolean
    regionProperty: string
    fields: FieldKeys
    percentKeys: Set<string>
    precision: number
}

const AppMap = forwardRef<MapRef, MapProps>(({ datasetMode, datasetCount, cityLabelProperty, showCities, showRegions, regionProperty, fields, percentKeys, precision }, ref) => {
    const regionRanges = useRegionRanges("/dataset-regions.geojson")
    const mapboxAccessToken = import.meta.env.VITE_MAPBOX_ACCESS_KEY
    const mapStyle = import.meta.env.VITE_MAPBOX_STYLE
    const mapRef = useRef<MapRef>(null)
    useImperativeHandle(ref, () => mapRef.current as MapRef)
    const [mapPopupActive, setMapPopupActive] = useState(false)
    const [clusterPopupActive, setClusterPopupActive] = useState(false)
    const cityPopupActive = showCities && (mapPopupActive || clusterPopupActive)

    const datasets = useMemo(() => getDatasets(datasetMode, datasetCount), [datasetMode, datasetCount])
    const clusterLayerIds = useMemo(() => getClusterLayerIds(datasetMode, datasetCount), [datasetMode, datasetCount])
    const unclusteredPointLayerIds = useMemo(() => getUnclusteredLayerIds(datasetMode, datasetCount), [datasetMode, datasetCount])

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
            <RegionLayer regionProperty={regionProperty} regionLabelKey={fields.region} visible={showRegions} ranges={regionRanges} />
            {showRegions && <RegionPopup fields={fields} regionProperty={regionProperty} percentKeys={percentKeys} precision={precision} disabled={cityPopupActive} />}
            {datasets.map((ds) => (
                <DatasetLayer key={ds.id} id={ds.id} dataUrl={ds.dataUrl} labelProperty={cityLabelProperty} cityNameKey={fields.cityName} visible={showCities} />
            ))}
            {showCities && (
                <>
                    <ClusterPopup layerNames={clusterLayerIds} fields={fields} onActiveChange={setClusterPopupActive} />
                    <MapPopup layerNames={unclusteredPointLayerIds} fields={fields} onActiveChange={setMapPopupActive} />
                </>
            )}
        </MapGl>
    )
})

export default AppMap
