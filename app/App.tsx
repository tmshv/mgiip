import "mapbox-gl/dist/mapbox-gl.css";
import "~/styles/index.css";
import "~/styles/mapbox.css";
import "~/components/map-popup/styles.css";

import Map from "~/components/map";

export default function App() {
    return <Map
        clusterProperty="победители"
        displayProperty="победители"
    />;
}
