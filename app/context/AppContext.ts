import type { LngLatBoundsLike } from "mapbox-gl"
import { createContext } from "react"

export type AppContextValue = {
    sidePanelRatio: number
    getProjectBounds: (slug: string) => LngLatBoundsLike | undefined
    setSidePanelRatio: (sidePanelRatio: number) => void
}

export const AppContext = createContext<AppContextValue | null>(null)
