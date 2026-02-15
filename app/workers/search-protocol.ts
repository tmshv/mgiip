import type { SearchItem } from "../lib/search"
import type { FieldKeys } from "../types/fields"

export type LoadRequest = {
    type: "load"
    fields: FieldKeys
    datasetCount: number
}

export type SearchRequest = {
    type: "search"
    query: string
    requestId: number
}

export type WorkerRequest = LoadRequest | SearchRequest

export type LoadedResponse = {
    type: "loaded"
}

export type ResultsResponse = {
    type: "results"
    items: SearchItem[]
    requestId: number
}

export type ErrorResponse = {
    type: "error"
    message: string
}

export type WorkerResponse = LoadedResponse | ResultsResponse | ErrorResponse
