import { GeoJSONFeature, MapMouseEvent } from "mapbox-gl";
import { useEffect, useState } from "react";
import { LayerProps, useMap } from "react-map-gl/mapbox";
import { Layer, Source } from "react-map-gl/mapbox";
import useHover from "~/hooks/use-hover";

const layer: LayerProps = {
    id: "russia-states-border",
    type: "fill",
    paint: {
        "fill-color": "#ffffff",
        "fill-opacity": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            0.4,
            0.0
        ],
    },
    maxzoom: 6,
};

type Event = MapMouseEvent & {
    features?: GeoJSONFeature[]
}

export type MapLayerHoverableProps = {
}

const MapLayerHoverable: React.FC<MapLayerHoverableProps> = () => {
    useHover("russia-states", "russia-states-border");
    const { current } = useMap()

    const [state, setState] = useState<{ label: string, x: number, y: number } | null>(null)

    useEffect(() => {
        const map = current?.getMap()
        if (!map) {
            return
        }

        const callback = (event: Event) => {
            if (!event.features) {
                return setState(null)
            }
            if (event.features?.length === 0) {
                return setState(null)
            }
            const feature = event.features[0]
            const props = feature.properties
            if (!props) {
                return setState(null)
            }
            setState({
                label: props["name"],
                x: event.point.x,
                y: event.point.y,
            })
        }

        const clear = () => {
            setState(null)
        }

        map.on("mousemove", "russia-states-border", callback)
        map.on("mouseleave", "russia-states-border", clear)

        return () => {
            map.off("mousemove", callback)
            map.off("mouseleave", clear)
        }
    }, [current])

    return (
        <>
            <Source id="russia-states" type="geojson" data="/states-naturalearth.geojson">
                <Layer {...layer} />
            </Source>
            {!state ? null : (
                <div
                    style={{
                        position: "absolute",
                        top: state.y + 8,
                        left: state.x + 8,
                        background: "#000000",
                        color: "#ffffff",
                    }}
                >
                    {state.label}
                </div>
            )}
        </>
    );
}

export default MapLayerHoverable
