export type DatasetMode = "single" | "multi"

export type DatasetConfig = {
    id: string
    dataUrl: string
}

export function getDatasets(mode: DatasetMode, count: number): DatasetConfig[] {
    if (mode === "single") {
        return [{ id: "all", dataUrl: "/dataset.geojson" }]
    }
    return Array.from({ length: count }, (_, i) => ({
        id: String(i + 1),
        dataUrl: `/dataset${i + 1}.geojson`,
    }))
}

export function getClusterLayerIds(mode: DatasetMode, count: number): string[] {
    return getDatasets(mode, count).map((d) => `clusters-${d.id}`)
}

export function getUnclusteredLayerIds(mode: DatasetMode, count: number): string[] {
    return getDatasets(mode, count).map((d) => `unclustered-point-${d.id}`)
}
