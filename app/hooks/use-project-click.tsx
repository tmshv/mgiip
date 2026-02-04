import useMapPointer from "~/hooks/map-pointer";
import { useMapClick, useMapLayerClick } from "~/hooks/map-click";

type ProjectClickOptions = {
    onBackgroundClick?: () => void;
    onProjectClick?: (href: string) => void;
}

export default function useProjectClick(layerName: string, options: ProjectClickOptions = {}) {
    const { onBackgroundClick, onProjectClick } = options;

    useMapPointer([layerName]);
    useMapClick(() => {
        onBackgroundClick?.();
    });
    useMapLayerClick(layerName, event => {
        if (event.features && event.features.length > 0) {
            const f = event.features[0];
            const href = f.properties?.href;
            if (href && onProjectClick) {
                event.originalEvent.stopPropagation();
                onProjectClick(href);
            }
        }
    });
}
