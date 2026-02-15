import fs from "node:fs"
import path from "node:path"
import { bench, describe } from "vitest"
import { fuzzyMatch, type SearchItem, searchItems } from "~/lib/search"

// --- Helpers ---

const CYRILLIC_NAMES = [
    "Москва",
    "Санкт-Петербург",
    "Новосибирск",
    "Екатеринбург",
    "Казань",
    "Нижний Новгород",
    "Челябинск",
    "Самара",
    "Омск",
    "Ростов-на-Дону",
    "Уфа",
    "Красноярск",
    "Воронеж",
    "Пермь",
    "Волгоград",
    "Краснодар",
    "Саратов",
    "Тюмень",
    "Тольятти",
    "Ижевск",
    "Барнаул",
    "Ульяновск",
    "Иркутск",
    "Хабаровск",
    "Ярославль",
    "Владивосток",
    "Махачкала",
    "Томск",
    "Оренбург",
    "Кемерово",
]

function generateItems(count: number): SearchItem[] {
    const items: SearchItem[] = []
    for (let i = 0; i < count; i++) {
        const base = CYRILLIC_NAMES[i % CYRILLIC_NAMES.length]
        const suffix = count > CYRILLIC_NAMES.length ? `-${Math.floor(i / CYRILLIC_NAMES.length)}` : ""
        items.push({
            name: `${base}${suffix}`,
            tag: "регион",
            coordinate: [37.6 + (i % 60) * 0.5, 55.7 + (i % 40) * 0.3],
            zoom: 10,
        })
    }
    return items
}

function loadRealData(): SearchItem[] {
    const publicDir = path.resolve(__dirname, "../../public")
    const items: SearchItem[] = []
    const seen = new Set<string>()

    for (let i = 1; i <= 89; i++) {
        const filePath = path.join(publicDir, `dataset${i}.geojson`)
        if (!fs.existsSync(filePath)) continue
        const fc = JSON.parse(fs.readFileSync(filePath, "utf-8"))
        for (const feature of fc.features) {
            const coords = feature.geometry?.coordinates
            const name = feature.properties?.нп
            const tag = feature.properties?.регион ?? ""
            if (!name || !coords) continue
            const key = `${name}|${tag}`
            if (seen.has(key)) continue
            seen.add(key)
            items.push({ name, tag, coordinate: [coords[0], coords[1]], zoom: 10 })
        }
    }

    // Add regions
    const regionsPath = path.join(publicDir, "dataset-regions-point.geojson")
    if (fs.existsSync(regionsPath)) {
        const fc = JSON.parse(fs.readFileSync(regionsPath, "utf-8"))
        for (const feature of fc.features) {
            const coords = feature.geometry?.coordinates
            const name = feature.properties?.регион
            const tag = feature.properties?.фо ?? ""
            if (name && coords) {
                items.push({ name, tag, coordinate: [coords[0], coords[1]], zoom: 6 })
            }
        }
    }

    return items
}

// --- Load data ---

const realItems = loadRealData()
const items5k = generateItems(5_000)
const items10k = generateItems(10_000)
const items25k = generateItems(25_000)
const items50k = generateItems(50_000)

console.log(`Real dataset: ${realItems.length} items`)

// --- Benchmarks ---

describe("fuzzyMatch — single call", () => {
    bench("1-char query, short text (match)", () => {
        fuzzyMatch("м", "Москва")
    })

    bench("3-char query, short text (match)", () => {
        fuzzyMatch("мос", "Москва")
    })

    bench("6-char query, medium text (match)", () => {
        fuzzyMatch("москва", "Москва")
    })

    bench("3-char query, long text (match)", () => {
        fuzzyMatch("рос", "Ростов-на-Дону")
    })

    bench("3-char query, no match", () => {
        fuzzyMatch("xyz", "Москва")
    })

    bench("6-char query, no match", () => {
        fuzzyMatch("xyzabc", "Санкт-Петербург")
    })
})

describe(`searchItems — real data (${realItems.length} items)`, () => {
    bench("1-char query «м»", () => {
        searchItems(realItems, "м", 15)
    })

    bench("3-char query «мос»", () => {
        searchItems(realItems, "мос", 15)
    })

    bench("6-char query «москва»", () => {
        searchItems(realItems, "москва", 15)
    })

    bench("no match «xyzxyz»", () => {
        searchItems(realItems, "xyzxyz", 15)
    })
})

describe("searchItems — scaling", () => {
    bench("5,000 items", () => {
        searchItems(items5k, "мос", 15)
    })

    bench("10,000 items", () => {
        searchItems(items10k, "мос", 15)
    })

    bench("25,000 items", () => {
        searchItems(items25k, "мос", 15)
    })

    bench("50,000 items", () => {
        searchItems(items50k, "мос", 15)
    })
})
