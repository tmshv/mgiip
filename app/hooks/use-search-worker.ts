import { useEffect, useRef, useState } from "react"
import type { SearchItem } from "~/lib/search"
import type { FieldKeys } from "~/types/fields"
import type { WorkerRequest, WorkerResponse } from "~/workers/search-protocol"

export function useSearchWorker(fields: FieldKeys, datasetCount: number) {
    const [query, setQuery] = useState("")
    const [results, setResults] = useState<SearchItem[]>([])
    const [loading, setLoading] = useState(true)
    const workerRef = useRef<Worker | null>(null)
    const requestIdRef = useRef(0)

    useEffect(() => {
        const worker = new Worker(new URL("../workers/search.worker.ts", import.meta.url), { type: "module" })
        workerRef.current = worker

        worker.onmessage = (e: MessageEvent<WorkerResponse>) => {
            const msg = e.data
            if (msg.type === "loaded") {
                setLoading(false)
            } else if (msg.type === "results") {
                if (msg.requestId === requestIdRef.current) {
                    setResults(msg.items)
                }
            } else if (msg.type === "error") {
                setLoading(false)
            }
        }

        const loadMsg: WorkerRequest = { type: "load", fields, datasetCount }
        worker.postMessage(loadMsg)

        return () => {
            worker.terminate()
            workerRef.current = null
        }
    }, [fields, datasetCount])

    useEffect(() => {
        const q = query.trim()
        if (!q) {
            setResults([])
            return
        }

        requestIdRef.current++
        const searchMsg: WorkerRequest = { type: "search", query: q, requestId: requestIdRef.current }
        workerRef.current?.postMessage(searchMsg)
    }, [query])

    return { query, setQuery, results, loading }
}
