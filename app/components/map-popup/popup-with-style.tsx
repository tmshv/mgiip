import { useMemo, useState } from "react";
import { Popup } from "react-map-gl/mapbox";
import type { PopupProps } from "react-map-gl/mapbox";
import { useNextTick } from "~/hooks/use-next-tick";

// this component will fix an issue from react-map-gl related to custom
// max-width style for mapbox popup container
// I dont know why but it is update it skip value of style on mount
// and second render goes well
const PopupWithStyle: React.FC<PopupProps> = ({ style, ...props }) => {
    const [currentStyle, setStyle] = useState<React.CSSProperties | undefined>();
    const callback = useMemo(() => {
        return () => {
            setStyle(style);
        }
    }, [style])
    useNextTick(callback)

    return (
        <Popup
            {...props}
            style={currentStyle}
        />
    );
}

export default PopupWithStyle
