import { useMemo, useState } from "react"
import type { SearchItem } from "~/lib/search"
import { searchItems } from "~/lib/search"

const MAX_RESULTS = 15

export function useSearch(items: SearchItem[]) {
    const [query, setQuery] = useState("")

    const results = useMemo(() => {
        return searchItems(items, query, MAX_RESULTS)
    }, [items, query])

    return { query, setQuery, results }
}
