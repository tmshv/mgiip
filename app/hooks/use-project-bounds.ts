import { useEffect, useRef } from "react";
import { bbox } from "@turf/bbox";
import type { LngLatBoundsLike } from "mapbox-gl";

function createMapById(features: GeoJSON.Feature[]) {
    return features.reduce((acc, feature) => {
        acc.set(feature.properties!.id, bbox(feature) as LngLatBoundsLike)
        return acc
    }, new Map<number | string, LngLatBoundsLike>())
}

function createMapBySlug(features: GeoJSON.Feature[]) {
    return features.reduce((acc, feature) => {
        acc.set(feature.properties!["slug"], bbox(feature) as LngLatBoundsLike)
        return acc
    }, new Map<number | string, LngLatBoundsLike>())
}

export default function useProjectBounds(href: string) {
    const data = useRef<Map<number|string, LngLatBoundsLike>>(new Map())
    useEffect(() => {
        const stop = new AbortController()
        fetch(href, {
            signal: stop.signal,
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error("not ok")
                }
                return res.json()
            })
            .then((fc: GeoJSON.FeatureCollection) => {
                data.current = createMapBySlug(fc.features)
            })
            .catch(err => { })
        return () => {
            stop.abort()
        }
    }, [href])

    return (slug: string) => {
        return data.current.get(slug)
    }
}

