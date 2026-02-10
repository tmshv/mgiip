import { useMemo } from "react"
import useMapPointer from "~/hooks/map-pointer"
import { useMapHover } from "~/hooks/use-map-hover"
import PopupWithStyle from "./map-popup/popup-with-style"

import "./map-popup/styles.css"

const REGION_LAYERS = ["regions-fill"]

const style: React.CSSProperties = {
    maxWidth: 300,
}

export type RegionPopupProps = {
    regionProperty: string
}

const SKIP_KEYS = new Set(["регион", "федеральный округ"])

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

function useRegionData(properties: GeoJSON.GeoJsonProperties | null, regionProperty: string): RegionData | null {
    return useMemo(() => {
        if (!properties) {
            return null
        }

        const attributes: Attribute[] = []
        for (const [key, value] of Object.entries(properties)) {
            if (SKIP_KEYS.has(key)) {
                continue
            }
            attributes.push({
                key,
                value: formatValue(value),
                highlight: key === regionProperty,
            })
        }

        return {
            name: properties["регион"] ?? "",
            district: properties["федеральный округ"] ?? "",
            attributes,
        }
    }, [properties, regionProperty])
}

const RegionPopup: React.FC<RegionPopupProps> = ({ regionProperty }) => {
    useMapPointer(REGION_LAYERS)
    const { feature, clear } = useMapHover(REGION_LAYERS, { followCursor: true })
    const data = useRegionData(feature?.properties ?? null, regionProperty)

    if (!feature || !data) {
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
