import { useCallback, useEffect, useRef, useState } from "react"
import { useSearchWorker } from "~/hooks/use-search-worker"
import type { FieldKeys } from "~/types/fields"
import "./styles.css"

export type SearchOverlayProps = {
    fields: FieldKeys
    datasetCount: number
    onSelect: (coordinate: [number, number], zoom: number) => void
}

export default function SearchOverlay({ fields, datasetCount, onSelect }: SearchOverlayProps) {
    const { query, setQuery, results, loading } = useSearchWorker(fields, datasetCount)
    const [open, setOpen] = useState(false)
    const [activeIndex, setActiveIndex] = useState(-1)
    const containerRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const showDropdown = open && results.length > 0

    const selectItem = useCallback(
        (coordinate: [number, number], zoom: number) => {
            onSelect(coordinate, zoom)
            setOpen(false)
            setQuery("")
            inputRef.current?.blur()
        },
        [onSelect, setQuery],
    )

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === "ArrowDown") {
                e.preventDefault()
                setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev))
            } else if (e.key === "ArrowUp") {
                e.preventDefault()
                setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev))
            } else if (e.key === "Enter") {
                e.preventDefault()
                if (activeIndex >= 0 && activeIndex < results.length) {
                    const item = results[activeIndex]
                    selectItem(item.coordinate, item.zoom)
                }
            } else if (e.key === "Escape") {
                setOpen(false)
                inputRef.current?.blur()
            }
        },
        [results, activeIndex, selectItem],
    )

    // biome-ignore lint/correctness/useExhaustiveDependencies: reset active index when results change
    useEffect(() => {
        setActiveIndex(-1)
    }, [results])

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <div ref={containerRef} className="search-overlay">
            <input
                ref={inputRef}
                type="text"
                placeholder={loading ? "Загрузка..." : "Поиск города или региона..."}
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value)
                    setOpen(true)
                }}
                onFocus={() => setOpen(true)}
                onKeyDown={handleKeyDown}
            />
            {showDropdown && (
                <div className="search-dropdown">
                    {results.map((item, i) => (
                        <div
                            key={`${item.name}-${item.tag}`}
                            className="search-dropdown-item"
                            data-active={i === activeIndex}
                            onMouseEnter={() => setActiveIndex(i)}
                            onMouseDown={() => selectItem(item.coordinate, item.zoom)}
                        >
                            <div className="search-dropdown-item-name">{item.name}</div>
                            <div className="search-dropdown-item-tag">{item.tag}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
