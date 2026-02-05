import "mapbox-gl/dist/mapbox-gl.css";
import "~/styles/index.css";
import "~/styles/mapbox.css";
import "~/components/map-popup/styles.css";

import { useControls } from "leva";
import Map from "~/components/map";

export default function App() {
    const { label, regions } = useControls({
        label: {
            options: {
                "подавался": "подавался",
                "победители": "победители",
            },
            value: "победители"
        },
        regions: false,
    });

    return <Map
        labelProperty={label}
        showRegions={regions}
    />;
}
