import useMapPointer from "~/hooks/map-pointer"
import { useClusterLeaves } from "~/hooks/use-cluster-leaves"
import { useClusterPopupData } from "~/hooks/use-cluster-popup-data"
import { useMapHover } from "~/hooks/use-map-hover"
import type { FieldKeys } from "~/types/fields"
import PopupWithStyle from "./map-popup/popup-with-style"

import "./map-popup/styles.css"

export type ClusterPopupProps = {
    layerNames: string[]
    fields: FieldKeys
}

function formatName(type: string, name: string): string {
    if (!type) return name
    return `${type}. ${name}`
}

const ClusterPopup: React.FC<ClusterPopupProps> = ({ layerNames, fields }) => {
    useMapPointer(layerNames)
    const { feature, clear } = useMapHover(layerNames)
    const pointCount = (feature?.properties?.point_count as number) ?? 0
    const { leaves, loading } = useClusterLeaves(feature?.source ?? null, feature?.clusterId ?? null, pointCount, {
        cityNameKey: fields.cityName,
        cityTypeKey: fields.cityType,
        regionKey: fields.region,
        populationKey: fields.population,
    })
    const data = useClusterPopupData(feature?.properties ?? null, leaves, loading)

    if (!feature || !data) {
        return null
    }

    return (
        <PopupWithStyle longitude={feature.coord[0]} latitude={feature.coord[1]} anchor="bottom" onClose={clear} closeButton={false} className="my-popup">
            <div className="cluster-popup">
                <div className="cluster-popup-header">{data.pointCount} населенных пунктов</div>
                {data.loading ? (
                    <div className="cluster-popup-loading">...</div>
                ) : (
                    <>
                        <ul className="cluster-popup-list">
                            {data.leaves.map((leaf) => (
                                <li key={`${leaf.region}-${leaf.name}`} className="cluster-popup-item">
                                    <span className="cluster-popup-name">{formatName(leaf.type, leaf.name)}</span>
                                    <span className="cluster-popup-region">{leaf.region}</span>
                                </li>
                            ))}
                        </ul>
                        {data.hasMore && <div className="cluster-popup-more">... и ещё {data.pointCount - data.leaves.length}</div>}
                    </>
                )}
            </div>
        </PopupWithStyle>
    )
}

export default ClusterPopup
