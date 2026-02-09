import { useMemo } from "react";
import type { ClusterLeaf } from "./use-cluster-leaves";

export type ClusterPopupData = {
    pointCount: number;
    leaves: ClusterLeaf[];
    loading: boolean;
    hasMore: boolean;
};

export function useClusterPopupData(
    properties: GeoJSON.GeoJsonProperties | null,
    leaves: ClusterLeaf[],
    loading: boolean,
): ClusterPopupData | null {
    return useMemo(() => {
        if (!properties?.point_count) {
            return null;
        }

        const pointCount = properties.point_count as number;

        return {
            pointCount,
            leaves,
            loading,
            hasMore: pointCount > leaves.length,
        };
    }, [properties, leaves, loading]);
}
