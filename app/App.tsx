import "mapbox-gl/dist/mapbox-gl.css"
import "~/styles/index.css"
import "~/styles/mapbox.css"
import "~/components/map-popup/styles.css"
import "~/components/header/styles.css"

import { Leva, useControls } from "leva"
import { useCallback, useRef } from "react"
import type { MapRef } from "react-map-gl/mapbox"
import Header from "~/components/header"
import AppMap from "~/components/map"
import type { FieldKeys } from "~/types/fields"

const fields: FieldKeys = {
    cityName: "нп",
    cityType: "тип",
    onp: "онп",
    region: "регион",
    regionDistrict: "фо",
    district: "федеральный округ",
    population: "население",
    applications: "подавался",
    winners: "победители",
    winRate: "доля побед",
}

const DATASET_COUNT = 89

const percentKeys = new Set(["доля побед", "эффективность"])

const heatmapOptions = {
    "2018_подача": "2018_подача",
    "2018_победа": "2018_победа",
    "2019_подача": "2019_подача",
    "2019_победа": "2019_победа",
    "2020_1_подача": "2020_1_подача",
    "2020_1_победа": "2020_1_победа",
    "2020_2_подача": "2020_2_подача",
    "2020_2_победа": "2020_2_победа",
    "2021_подача": "2021_подача",
    "2021_победа": "2021_победа",
    "2022_1_подача": "2022_1_подача",
    "2022_1_победа": "2022_1_победа",
    "2022_2_подача": "2022_2_подача",
    "2022_2_победа": "2022_2_победа",
    "2023_подача": "2023_подача",
    "2023_победа": "2023_победа",
    "2024_подача": "2024_подача",
    "2024_победа": "2024_победа",
    "2025_подача": "2025_подача",
    "2025_победа": "2025_победа",
}

const regionOptions = {
    население: "население",
    "населенных пунктов": "населенных пунктов",
    "города участники": "города участники",
    "всего заявок": "всего заявок",
    победители: "победители",
    "доля побед": "доля побед",
    эффективность: "эффективность",
    ОНП: "ОНП",
}

export default function App() {
    const {
        city_param: cityParam,
        city: showCities,
        region: showRegions,
        region_param: regionParam,
        heatmap: showHeatmap,
        heatmap_param: heatmapParam,
    } = useControls({
        city: true,
        city_param: {
            options: {
                подавался: "подавался",
                победители: "победители",
            },
            value: "победители",
        },
        region: true,
        region_param: {
            options: regionOptions,
            value: "победители",
        },
        heatmap: false,
        heatmap_param: {
            options: heatmapOptions,
            value: "2025_победа",
        },
    })
    const precision = 2
    const datasetMode = "multi"
    const mapRef = useRef<MapRef>(null)

    const handleSearchSelect = useCallback((coordinate: [number, number], zoom: number) => {
        mapRef.current?.flyTo({ center: coordinate, zoom })
    }, [])

    return (
        <>
            <Leva titleBar={{ position: { x: 0, y: 46 } }} />
            <AppMap
                ref={mapRef}
                datasetMode={datasetMode}
                datasetCount={DATASET_COUNT}
                cityLabelProperty={cityParam}
                showCities={showCities}
                showRegions={showRegions}
                regionProperty={regionParam}
                showHeatmap={showHeatmap}
                heatmapProperty={heatmapParam}
                fields={fields}
                percentKeys={percentKeys}
                precision={precision}
            />
            <Header fields={fields} datasetCount={DATASET_COUNT} onSearchSelect={handleSearchSelect} />
        </>
    )
}
