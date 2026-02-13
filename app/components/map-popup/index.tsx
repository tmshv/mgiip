import { useEffect } from "react"
import useMapPointer from "~/hooks/map-pointer"
import { useMapHover } from "~/hooks/use-map-hover"
import { usePopupData } from "~/hooks/use-popup-data"
import type { FieldKeys } from "~/types/fields"
import PopupWithStyle from "./popup-with-style"

import "./styles.css"

const style: React.CSSProperties = {
    maxWidth: 400,
}

export type MapPopupProps = {
    layerNames: string[]
    fields: FieldKeys
    onActiveChange?: (active: boolean) => void
}

const MapPopup: React.FC<MapPopupProps> = ({ layerNames, fields, onActiveChange }) => {
    useMapPointer(layerNames)
    const { feature, clear } = useMapHover(layerNames)
    const data = usePopupData({
        properties: feature?.properties ?? null,
        fields,
    })

    const active = feature !== null
    useEffect(() => {
        onActiveChange?.(active)
        return () => onActiveChange?.(false)
    }, [active, onActiveChange])

    if (!feature || !data) {
        return null
    }

    return (
        <PopupWithStyle longitude={feature.coord[0]} latitude={feature.coord[1]} anchor="bottom" onClose={clear} closeButton={false} className={"my-popup"} style={style}>
            <h2 className="popup-header">
                {data.title}
                {data.onp && <span className="popup-onp"> ({data.onp})</span>}
            </h2>
            <div className="popup-location">
                <div>{data.region}</div>
                <div className="popup-location-district">{data.fedokrug} фо</div>
                <div className="popup-population">{data.population} жителей</div>
            </div>
            <table className="properties-table">
                <tbody>
                    {data.attributes.map(({ key, value, highlight }) => (
                        <tr key={key}>
                            <td className="prop-key">{key}</td>
                            <td className={highlight ? "prop-value prop-value-highlight" : "prop-value"}>{String(value)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </PopupWithStyle>
    )
}

export default MapPopup
