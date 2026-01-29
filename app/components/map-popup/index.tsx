import { useEffect, useState } from "react";
import { useMap } from "react-map-gl/mapbox";
import PopupWithStyle from "./popup-with-style";
import useMapPointer from "~/hooks/map-pointer";
import type { MapMouseEvent } from "react-map-gl/mapbox";

import "./styles.css";

function quotes(value: string): string {
    const close = '»'
    // skip close quote if it is already in the string
    if (value.charAt(value.length - 1) === close) {
        return `«${value}`
    }
    return `«${value}»`
}

function location(state: string, city: string): string {
    const nbsp = "\u00A0"
    return `${state}, г.${nbsp}${city}`
}

function splitCaption(text: string): [string, string] {
    const xs = text.split("\n\n")
    if (xs.length === 1) {
        return [text, ""]
    }
    return xs as [string, string]
}

const style: React.CSSProperties = {
    maxWidth: 300,
}

type Info = {
    coord: GeoJSON.Position,
    state: string,
    city: string,
    year: number,
    name: string,
    caption: string,
    src: string,
    extra: string
};

export type MapPopupProps = {
    layerName: string
}

const MapPopup: React.FC<MapPopupProps> = ({ layerName }) => {
    const [info, setInfo] = useState<Info | null>(null);
    const { current } = useMap();

    useMapPointer([layerName]);
    useEffect(() => {
        if (!current) {
            return
        }
        const map = current.getMap();
        const show = async (event: MapMouseEvent) => {
            if (event.features?.length === 0) {
                return
            }
            const feature = event.features![0]
            setInfo(null);
            if (!feature.properties) {
                return;
            }
            const geom = feature.geometry as GeoJSON.Point;
            const [caption, extra] = splitCaption(feature.properties.caption)
            setInfo({
                coord: geom.coordinates,
                name: feature.properties.name,
                year: feature.properties.year,
                state: feature.properties.state,
                city: feature.properties.city,
                src: feature.properties.src,
                caption,
                extra,
            });
        }
        const clear = () => {
            setInfo(null)
        }

        map.on("mouseover", layerName, show);
        map.on("mouseleave", layerName, clear);

        return () => {
            map.off("mouseover", layerName, show);
            map.off("mouseleave", layerName, clear);
        }
    }, [current, layerName]);

    if (!info) {
        return null;
    }

    return (
        <PopupWithStyle
            longitude={info.coord[0]}
            latitude={info.coord[1]}
            anchor="bottom"
            onClose={() => {
                setInfo(null)
            }}
            // closeOnClick={false}
            closeButton={false}
            className={"my-popup"}
            style={style}
        >
            <img
                className="cover"
                src={info.src}
                alt={"1"}
                width={100}
                height={100}
            />
            <div className="caption">
                <p className="caption-head">{quotes(info.name)}</p>
                <p className="text">{location(info.state, info.city)}</p>
                <p className="text">{info.caption}</p>
                {!info.extra ? null : (
                    <p className="caption-footer">{info.extra}</p>
                )}
            </div>
        </PopupWithStyle>
    );
}

export default MapPopup
