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
    labelProperty: string
}

const SKIP_KEYS = new Set(["name", "федеральный округ"])

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

const HIGHLIGHT_KEYS: Record<string, string> = {
    подавался: "итого подано заявок",
    победители: "победители",
}

function formatValue(value: unknown): string {
    if (typeof value === "number") {
        return Number.isInteger(value) ? String(value) : value.toFixed(2)
    }
    return String(value ?? "")
}

function useRegionData(properties: GeoJSON.GeoJsonProperties | null, labelProperty: string): RegionData | null {
    return useMemo(() => {
        if (!properties) {
            return null
        }

        const highlightKey = HIGHLIGHT_KEYS[labelProperty]
        const attributes: Attribute[] = []
        for (const [key, value] of Object.entries(properties)) {
            if (SKIP_KEYS.has(key)) {
                continue
            }
            attributes.push({
                key,
                value: formatValue(value),
                highlight: key === highlightKey,
            })
        }

        return {
            name: properties.name ?? "",
            district: properties["федеральный округ"] ?? "",
            attributes,
        }
    }, [properties, labelProperty])
}

const RegionPopup: React.FC<RegionPopupProps> = ({ labelProperty }) => {
    useMapPointer(REGION_LAYERS)
    const { feature, clear } = useMapHover(REGION_LAYERS, { followCursor: true })
    const data = useRegionData(feature?.properties ?? null, labelProperty)

    if (!feature || !data) {
        return null
    }

    return (
        <PopupWithStyle longitude={feature.coord[0]} latitude={feature.coord[1]} anchor="bottom" onClose={clear} closeButton={false} className={"my-popup"} style={style}>
            <h2 className="popup-header">{data.name}</h2>
            <div className="popup-location">
                <div className="popup-location-district">{data.district}</div>
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
