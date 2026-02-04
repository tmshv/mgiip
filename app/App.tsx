import "mapbox-gl/dist/mapbox-gl.css";
import "~/styles/index.css";
import "~/styles/mapbox.css";
import "~/components/map-popup/styles.css";

import { useControls } from "leva";
import Map from "~/components/map";

export default function App() {
    const { label } = useControls({
        label: {
            options: {
                "подавался": "подавался",
                "победители": "победители",
            },
            value: "победители"
        }
    });

    return <Map
        labelProperty={label}
    />;
}
