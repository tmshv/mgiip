import { useEffect, useState } from "react";
import { useMap } from "react-map-gl/mapbox";
import PopupWithStyle from "./popup-with-style";
import useMapPointer from "~/hooks/map-pointer";
import type { MapMouseEvent } from "react-map-gl/mapbox";

import "./styles.css";

const style: React.CSSProperties = {
    maxWidth: 400,
}

type Info = {
    coord: GeoJSON.Position;
    properties: Record<string, unknown>;
};

export type MapPopupProps = {
    layerName: string;
    cityTypeKey?: string;
    cityNameKey?: string;
    onpKey?: string;
    regionKey?: string;
    districtKey?: string;
    populationKey?: string;
}

const MapPopup: React.FC<MapPopupProps> = ({
    layerName,
    cityTypeKey = "тип",
    cityNameKey = "нп",
    onpKey = "онп",
    regionKey = "регион",
    districtKey = "федеральный округ",
    populationKey = "население",
}) => {
    const [info, setInfo] = useState<Info | null>(null);
    const { current } = useMap();

    useMapPointer([layerName]);
    useEffect(() => {
        if (!current) {
            return;
        }
        const map = current.getMap();
        const show = async (event: MapMouseEvent) => {
            if (!event.features?.length) {
                return;
            }
            const feature = event.features[0];
            if (!feature.properties) {
                return;
            }
            const geom = feature.geometry as GeoJSON.Point;
            setInfo({
                coord: geom.coordinates,
                properties: feature.properties,
            });
        };
        const clear = () => {
            setInfo(null);
        };

        map.on("mouseover", layerName, show);
        map.on("mouseleave", layerName, clear);

        return () => {
            map.off("mouseover", layerName, show);
            map.off("mouseleave", layerName, clear);
        };
    }, [current, layerName]);

    if (!info) {
        return null;
    }

    const cityType = info.properties[cityTypeKey];
    const cityName = info.properties[cityNameKey];
    const title = [
        cityType ? `${cityType}.` : null,
        cityName,
    ].filter(Boolean).join(" ");
    const onp = info.properties[onpKey];

    const contests = [
        "2018", "2018_1", "2018_2",
        "2019", "2019_1", "2019_2",
        "2020", "2020_1", "2020_2",
        "2021", "2021_1", "2021_2",
        "2022", "2022_1", "2022_2",
        "2023", "2023_1", "2023_2",
        "2024", "2024_1", "2024_2",
        "2025", "2025_1", "2025_2",
        "дфо1", "дфо2", "дфо3", "дфо4",
    ];
    const contestKeys = contests.flatMap((c) => [`${c}_подача`, `${c}_победа`]);
    const headerKeys = [cityTypeKey, cityNameKey, onpKey];
    const locationKeys = [regionKey, districtKey, populationKey];
    const excludedKeys = [...contestKeys, ...headerKeys, ...locationKeys];
    const otherProperties = Object.entries(info.properties).filter(
        ([key]) => !excludedKeys.includes(key)
    );

    return (
        <PopupWithStyle
            longitude={info.coord[0]}
            latitude={info.coord[1]}
            anchor="bottom"
            onClose={() => setInfo(null)}
            closeButton={false}
            className={"my-popup"}
            style={style}
        >
            <h2 className="popup-header">
                {title}
                {onp && <span className="popup-onp"> ({onp})</span>}
            </h2>
            <div className="popup-location">
                <div>{info.properties[regionKey]}</div>
                <div className="popup-location-district">{info.properties[districtKey]}</div>
                <div className="popup-population">{info.properties[populationKey]} жителей</div>
            </div>
            <table className="properties-table">
                <tbody>
                    {contests.map((contest) => {
                        const podacha = info.properties[`${contest}_подача`];
                        const pobeda = info.properties[`${contest}_победа`];
                        if (podacha == null && pobeda == null) {
                            return null;
                        }
                        return (
                            <tr key={contest}>
                                <td className="prop-key">{contest}</td>
                                <td className="prop-value">
                                    {podacha} / {pobeda}
                                </td>
                            </tr>
                        );
                    })}
                    {otherProperties.map(([key, value]) => (
                        <tr key={key}>
                            <td className="prop-key">{key}</td>
                            <td className="prop-value">{String(value)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </PopupWithStyle>
    );
};

export default MapPopup;
