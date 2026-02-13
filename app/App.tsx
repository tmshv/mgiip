import "mapbox-gl/dist/mapbox-gl.css"
import "~/styles/index.css"
import "~/styles/mapbox.css"
import "~/components/map-popup/styles.css"
import "~/components/search-overlay/styles.css"

import { useControls } from "leva"
import AppMap from "~/components/map"
import type { FieldKeys } from "~/types/fields"

const fields: FieldKeys = {
    cityName: "нп",
    cityType: "тип",
    onp: "онп",
    region: "регион",
    district: "федеральный округ",
    population: "население",
    applications: "подавался",
    winners: "победители",
    winRate: "доля побед",
}

const regionOptions = {
    "количество городов-участников конкурса": "количество городов-участников конкурса",
    "количество ОНП": "количество ОНП",
    "итого подано заявок": "итого подано заявок",
    победители: "победители",
    байес: "байес",
    "Оптимальность участия (доля побед)": "Оптимальность участия (доля побед)",
}

export default function App() {
    const { cityLabel, showCities, showRegions, regionParam } = useControls({
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

    return <AppMap cityLabelProperty={cityLabel} showCities={showCities} showRegions={showRegions} regionProperty={regionParam} fields={fields} />
}
