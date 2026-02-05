import { useMemo } from "react";

export type ClusterPopupData = {
    pointCount: number;
};

export function useClusterPopupData(
    properties: GeoJSON.GeoJsonProperties | null
): ClusterPopupData | null {
    return useMemo(() => {
        if (!properties?.point_count) {
            return null;
        }

        return {
            pointCount: properties.point_count,
        };
    }, [properties]);
}
