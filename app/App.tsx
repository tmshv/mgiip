import "mapbox-gl/dist/mapbox-gl.css"
import "~/styles/index.css"
import "~/styles/mapbox.css"
import "~/components/map-popup/styles.css"

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

export default function App() {
    const { label, regions } = useControls({
        label: {
            options: {
                подавался: "подавался",
                победители: "победители",
            },
            value: "победители",
        },
        regions: false,
    })

    return <AppMap labelProperty={label} showRegions={regions} fields={fields} />
}
