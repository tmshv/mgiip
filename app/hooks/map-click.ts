import type { MapLayerMouseEvent } from "mapbox-gl";
import { useEffect } from "react";
import { useMap } from "react-map-gl/mapbox";

export type MapClickCallback = (event: MapLayerMouseEvent) => void

export function useMapLayerClick(layerName: string, callback: MapClickCallback) {
    const { current } = useMap();

    useEffect(() => {
        if (!current) {
            return
        }
        const map = current.getMap();

        map.on("click", layerName, callback);

        return () => {
            map.off("click", layerName, callback);
        }
    }, [callback, current, layerName]);
}

export function useMapClick(callback: MapClickCallback) {
    const { current } = useMap();

    useEffect(() => {
        if (!current) {
            return
        }
        const map = current.getMap();

        map.on("click", callback);

        return () => {
            map.off("click", callback);
        }
    }, [callback, current]);
}
