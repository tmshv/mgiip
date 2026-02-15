import type { SearchItem } from "../lib/search"
import { searchItems } from "../lib/search"
import type { WorkerRequest, WorkerResponse } from "./search-protocol"

const ctx = globalThis as unknown as Worker

let items: SearchItem[] = []

function respond(msg: WorkerResponse) {
    ctx.postMessage(msg)
}

ctx.onmessage = async (e: MessageEvent<WorkerRequest>) => {
    const msg = e.data

    if (msg.type === "load") {
        try {
            const urls = Array.from({ length: msg.datasetCount }, (_, i) => `/dataset${i + 1}.geojson`)
            urls.push("/dataset-regions-point.geojson")

            const datasets = await Promise.all(urls.map((url) => fetch(url).then((r) => r.json())))

            const result: SearchItem[] = []
            const seen = new Set<string>()

            for (let i = 0; i < datasets.length; i++) {
                const fc = datasets[i]
                const isRegion = i === datasets.length - 1

                for (const feature of fc.features) {
                    const coords = feature.geometry?.coordinates
                    if (!coords) continue

                    if (isRegion) {
                        const name = feature.properties?.[msg.fields.region]
                        const tag = feature.properties?.[msg.fields.regionDistrict] ?? ""
                        if (name) {
                            result.push({ name, tag, coordinate: [coords[0], coords[1]], zoom: 6 })
                        }
                    } else {
                        const name = feature.properties?.[msg.fields.cityName]
                        const tag = feature.properties?.[msg.fields.region] ?? ""
                        if (name) {
                            const key = `${name}|${tag}`
                            if (!seen.has(key)) {
                                seen.add(key)
                                result.push({ name, tag, coordinate: [coords[0], coords[1]], zoom: 10 })
                            }
                        }
                    }
                }
            }

            items = result
            respond({ type: "loaded" })
        } catch (err) {
            respond({ type: "error", message: err instanceof Error ? err.message : String(err) })
        }
    } else if (msg.type === "search") {
        const results = searchItems(items, msg.query, 15)
        respond({ type: "results", items: results, requestId: msg.requestId })
    }
}
