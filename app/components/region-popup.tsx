import { useMemo } from "react"
import useMapPointer from "~/hooks/map-pointer"
import { useMapHover } from "~/hooks/use-map-hover"
import type { FieldKeys } from "~/types/fields"
import PopupWithStyle from "./map-popup/popup-with-style"

import "./map-popup/styles.css"

const REGION_LAYERS = ["regions-fill"]

const style: React.CSSProperties = {
    maxWidth: 300,
}

export type RegionPopupProps = {
    fields: FieldKeys
    regionProperty: string
    disabled?: boolean
}

type Attribute = {
    key: string
    value: string | number
    highlight: boolean
}

type RegionData = {
    name: string
    district: string
    attributes: Attribute[]
}

function formatValue(value: unknown): string {
    if (typeof value === "number") {
        return Number.isInteger(value) ? String(value) : value.toFixed(2)
    }
    return String(value ?? "")
}

function useRegionData(properties: GeoJSON.GeoJsonProperties | null, regionProperty: string, fields: FieldKeys): RegionData | null {
    return useMemo(() => {
        if (!properties) {
            return null
        }

        const skipKeys = new Set([fields.region, fields.regionDistrict])
        const attributes: Attribute[] = []
        for (const [key, value] of Object.entries(properties)) {
            if (skipKeys.has(key)) {
                continue
            }
            attributes.push({
                key,
                value: formatValue(value),
                highlight: key === regionProperty,
            })
        }

        return {
            name: properties[fields.region] ?? "",
            district: properties[fields.regionDistrict] ?? "",
            attributes,
        }
    }, [properties, regionProperty, fields])
}

const RegionPopup: React.FC<RegionPopupProps> = ({ fields, regionProperty, disabled }) => {
    useMapPointer(REGION_LAYERS)
    const { feature, clear } = useMapHover(REGION_LAYERS, { followCursor: true })
    const data = useRegionData(feature?.properties ?? null, regionProperty, fields)

    if (disabled || !feature || !data) {
        return null
    }

    return (
        <PopupWithStyle longitude={feature.coord[0]} latitude={feature.coord[1]} anchor="bottom" onClose={clear} closeButton={false} className={"my-popup"} style={style}>
            <h2 className="popup-header">{data.name}</h2>
            <div className="popup-location">
                <div className="popup-location-district">{data.district} фо</div>
            </div>
            <table className="properties-table">
                <tbody>
                    {data.attributes.map(({ key, value, highlight }) => (
                        <tr key={key}>
                            <td className="prop-key">{key}</td>
                            <td className={highlight ? "prop-value prop-value-highlight" : "prop-value"}>{value}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </PopupWithStyle>
    )
}

export default RegionPopup
