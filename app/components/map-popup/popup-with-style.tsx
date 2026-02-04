import { useLayoutEffect, useState } from "react";
import { Popup } from "react-map-gl/mapbox";
import type { PopupProps } from "react-map-gl/mapbox";

// This component fixes an issue from react-map-gl where custom
// max-width style is not applied on initial mount.
// Using useLayoutEffect ensures style is applied before browser paint.
const PopupWithStyle: React.FC<PopupProps> = ({ style, ...props }) => {
    const [currentStyle, setStyle] = useState<React.CSSProperties | undefined>(style);

    useLayoutEffect(() => {
        setStyle(style);
    }, [style]);

    return (
        <Popup
            {...props}
            style={currentStyle}
        />
    );
}

export default PopupWithStyle
