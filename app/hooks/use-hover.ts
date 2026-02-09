import { useEffect } from "react";
import { useMap } from "react-map-gl/mapbox";

export default function useHover(source: string, layerId: string) {
    const { current } = useMap();

    useEffect(() => {
        const map = current?.getMap();
        if (!map) {
            return;
        }

        let hoveredStateId: string | number | undefined = undefined;

        const over = (event: mapboxgl.MapMouseEvent) => {
            if (event.features && event.features.length > 0) {
                if (hoveredStateId !== undefined) {
                    map.setFeatureState(
                        { source, id: hoveredStateId },
                        { hover: false }
                    );
                }
                const featureId = event.features[0].id;
                if (featureId === undefined) return;
                hoveredStateId = featureId;
                map.setFeatureState(
                    { source, id: hoveredStateId },
                    { hover: true }
                );
            }
        }
        const out = () => {
            if (hoveredStateId !== undefined) {
                map.setFeatureState(
                    { source, id: hoveredStateId },
                    { hover: false }
                );
            }
            hoveredStateId = undefined;
        }

        map.on("mousemove", layerId, over);
        map.on("mouseleave", layerId, out);

        return () => {
            map.off("mousemove", layerId, over);
            map.off("mouseleave", layerId, out);
        }
    }, [current, source, layerId]);
}
