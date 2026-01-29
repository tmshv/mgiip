import { useEffect } from "react";
import { useMap } from "react-map-gl/mapbox";

export default function useMapPointer(layerIds: string[]) {
    const { current } = useMap();

    useEffect(() => {
        const map = current?.getMap();
        if (!map) {
            return;
        }
        const over = async () => {
            const element = map.getCanvasContainer();
            element.style.cursor = "pointer";
        }
        const out = async () => {
            const element = map.getCanvasContainer();
            element.style.cursor = "default";
        }

        map.on("mouseover", layerIds, over);
        map.on("mouseout", layerIds, out);

        return () => {
            map.off("mouseover", layerIds, over);
            map.off("mouseout", layerIds, out);
        }
    }, [current, layerIds]);
}
