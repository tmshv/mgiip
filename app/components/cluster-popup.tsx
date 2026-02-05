import PopupWithStyle from "./map-popup/popup-with-style";
import useMapPointer from "~/hooks/map-pointer";
import { useMapHover } from "~/hooks/use-map-hover";
import { useClusterPopupData } from "~/hooks/use-cluster-popup-data";

export type ClusterPopupProps = {
    layerNames: string[];
};

const ClusterPopup: React.FC<ClusterPopupProps> = ({ layerNames }) => {
    useMapPointer(layerNames);
    const { feature, clear } = useMapHover(layerNames);
    const data = useClusterPopupData(feature?.properties ?? null);

    if (!feature || !data) {
        return null;
    }

    return (
        <PopupWithStyle
            longitude={feature.coord[0]}
            latitude={feature.coord[1]}
            anchor="bottom"
            onClose={clear}
            closeButton={false}
            className="my-popup"
        >
            <div className="cluster-popup-count">
                {data.pointCount}
            </div>
        </PopupWithStyle>
    );
};

export default ClusterPopup;
