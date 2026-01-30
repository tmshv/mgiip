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
}

const MapPopup: React.FC<MapPopupProps> = ({ layerName }) => {
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
            <table className="properties-table">
                <tbody>
                    {Object.entries(info.properties).map(([key, value]) => (
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
