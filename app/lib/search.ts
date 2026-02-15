export type SearchItem = {
    name: string
    tag: string
    coordinate: [number, number]
    zoom: number
}

export function fuzzyMatch(query: string, text: string): number | null {
    const q = query.toLowerCase()
    const t = text.toLowerCase()

    // All query chars must appear sequentially in text
    let qi = 0
    let prevIndex = -1
    let score = 0
    let consecutive = 0

    for (let ti = 0; ti < t.length && qi < q.length; ti++) {
        if (t[ti] === q[qi]) {
            // Bonus for prefix match
            if (qi === 0 && ti === 0) {
                score += 10
            }
            // Bonus for consecutive matches
            if (ti === prevIndex + 1) {
                consecutive++
                score += consecutive * 2
            } else {
                consecutive = 0
                // Penalty for gap
                score -= ti - (prevIndex + 1)
            }
            score += 1
            prevIndex = ti
            qi++
        }
    }

    if (qi < q.length) return null

    // Bonus for shorter text (closer match density)
    score -= t.length * 0.1

    return score
}

export function searchItems(items: SearchItem[], query: string, maxResults: number): SearchItem[] {
    const q = query.trim()
    if (!q) return []

    const top: { item: SearchItem; score: number }[] = []
    let minScore = -Infinity

    for (const item of items) {
        const score = fuzzyMatch(q, item.name)
        if (score === null) continue
        if (top.length >= maxResults && score < minScore) continue

        // Find insertion index via linear scan (top is sorted desc by score, then asc by name)
        let idx = top.length
        for (let i = 0; i < top.length; i++) {
            if (score > top[i].score || (score === top[i].score && item.name.localeCompare(top[i].item.name) < 0)) {
                idx = i
                break
            }
        }

        top.splice(idx, 0, { item, score })

        if (top.length > maxResults) {
            top.length = maxResults
        }

        minScore = top[top.length - 1].score
    }

    return top.map((s) => s.item)
}
