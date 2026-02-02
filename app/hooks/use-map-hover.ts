import { useEffect, useState } from "react";
import { useMap } from "react-map-gl/mapbox";
import type { MapMouseEvent } from "react-map-gl/mapbox";

export type HoverFeature = {
    coord: GeoJSON.Position;
    properties: GeoJSON.GeoJsonProperties;
};

export function useMapHover(layerName: string): { feature: HoverFeature | null; clear: () => void } {
    const [feature, setFeature] = useState<HoverFeature | null>(null);
    const { current } = useMap();

    useEffect(() => {
        if (!current) {
            return;
        }
        const map = current.getMap();

        const show = (event: MapMouseEvent) => {
            if (!event.features?.length) {
                return;
            }
            const f = event.features[0];
            if (!f.properties) {
                return;
            }
            const geom = f.geometry as GeoJSON.Point;
            setFeature({
                coord: geom.coordinates,
                properties: f.properties,
            });
        };

        const hide = () => {
            setFeature(null);
        };

        map.on("mouseover", layerName, show);
        map.on("mouseleave", layerName, hide);

        return () => {
            map.off("mouseover", layerName, show);
            map.off("mouseleave", layerName, hide);
        };
    }, [current, layerName]);

    const clear = () => setFeature(null);

    return { feature, clear };
}
