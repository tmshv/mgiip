import "mapbox-gl/dist/mapbox-gl.css"
import "~/styles/index.css"
import "~/styles/mapbox.css"
import "~/components/map-popup/styles.css"
import "~/components/search-overlay/styles.css"

import { useControls } from "leva"
import AppMap from "~/components/map"
import type { DatasetMode } from "~/lib/datasets"
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

const regionOptions = {
    население: "население",
    "населенных пунктов": "населенных пунктов",
    "города участники": "города участники",
    "всего заявок": "всего заявок",
    победители: "победители",
    "доля побед": "доля побед",
    "эффективность": "эффективность",
}

export default function App() {
    const { datasetMode, cityLabel, showCities, showRegions, regionParam } = useControls({
        datasetMode: {
            options: {
                single: "single",
                multi: "multi",
            } satisfies Record<string, DatasetMode>,
            value: "multi" as DatasetMode,
        },
        cityLabel: {
            options: {
                подавался: "подавался",
                победители: "победители",
            },
            value: "победители",
        },
        showCities: true,
        showRegions: false,
        regionParam: {
            options: regionOptions,
            value: "победители",
        },
    })
    const precision = 2

    return (
        <AppMap
            datasetMode={datasetMode}
            datasetCount={DATASET_COUNT}
            cityLabelProperty={cityLabel}
            showCities={showCities}
            showRegions={showRegions}
            regionProperty={regionParam}
            fields={fields}
            percentKeys={percentKeys}
            precision={precision}
        />
    )
}
