import { links as popupStyles } from "~/components/map-popup";

import AffinumOverlay from "~/components/affinum-overlay";
import { lazy, Suspense, useState } from "react";
import ClientOnly from "~/components/client-only";
import { AppContext } from "~/context/AppContext";
import useProjectBounds from "~/hooks/use-project-bounds";

let Map = lazy(() => import("~/components/map"));

export function links() {
    return [
        ...popupStyles(),
    ];
}

export type MainMapProps = {
    children: React.ReactNode
}

export default function MainMap({ children }: MainMapProps) {
    const [sidePanelRatio, setSidePanelRatio] = useState(0.65)
    const getProjectBounds = useProjectBounds("/boundaries.geojson")

    return (
        <AppContext.Provider value={{
            getProjectBounds,
            sidePanelRatio,
            setSidePanelRatio,
        }}>
            <ClientOnly>
                <Suspense>
                    <Map />
                </Suspense>
            </ClientOnly>
            {children}
            <AffinumOverlay />
        </AppContext.Provider>
    );
}

