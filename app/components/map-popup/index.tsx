import PopupWithStyle from "./popup-with-style";
import useMapPointer from "~/hooks/map-pointer";
import { useMapHover } from "~/hooks/use-map-hover";
import { usePopupData } from "~/hooks/use-popup-data";

import "./styles.css";

const style: React.CSSProperties = {
    maxWidth: 400,
}

export type MapPopupProps = {
    layerNames: string[];
    cityTypeKey?: string;
    cityNameKey?: string;
    onpKey?: string;
    regionKey?: string;
    districtKey?: string;
    populationKey?: string;
}

const MapPopup: React.FC<MapPopupProps> = ({
    layerNames,
    cityTypeKey = "тип",
    cityNameKey = "нп",
    onpKey = "онп",
    regionKey = "регион",
    districtKey = "федеральный округ",
    populationKey = "население",
}) => {
    useMapPointer(layerNames);
    const { feature, clear } = useMapHover(layerNames);
    const data = usePopupData({
        properties: feature?.properties ?? null,
        cityTypeKey,
        cityNameKey,
        onpKey,
        regionKey,
        districtKey,
        populationKey,
    });

    if (!feature || !data) {
        return null;
    }

    return (
        <PopupWithStyle
            longitude={feature.coord[0]}
            latitude={feature.coord[1]}
            anchor="bottom"
            onClose={clear}
            closeButton={false}
            className={"my-popup"}
            style={style}
        >
            <h2 className="popup-header">
                {data.title}
                {data.onp && <span className="popup-onp"> ({data.onp})</span>}
            </h2>
            <div className="popup-location">
                <div>{data.region}</div>
                <div className="popup-location-district">{data.fedokrug}</div>
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
    );
};

export default MapPopup;
