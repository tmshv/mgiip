import { describe, expect, it } from "vitest"
import { computeMaxRanges } from "~/hooks/use-region-ranges"

describe("computeMaxRanges", () => {
    it("returns max per numeric property across multiple features", () => {
        const geojson = {
            features: [{ properties: { a: 1, b: 10 } }, { properties: { a: 5, b: 3 } }, { properties: { a: 2, b: 7 } }],
        }
        expect(computeMaxRanges(geojson)).toEqual({ a: 5, b: 10 })
    })

    it("ignores non-numeric property values", () => {
        const geojson = {
            features: [{ properties: { name: "hello", flag: true, empty: null, count: 42 } }],
        }
        expect(computeMaxRanges(geojson)).toEqual({ count: 42 })
    })

    it("handles features with null properties", () => {
        const geojson = {
            features: [{ properties: null }, { properties: { a: 3 } }],
        }
        expect(computeMaxRanges(geojson)).toEqual({ a: 3 })
    })

    it("handles features with missing properties", () => {
        const geojson = {
            features: [{}, { properties: { a: 7 } }],
        }
        expect(computeMaxRanges(geojson)).toEqual({ a: 7 })
    })

    it("returns empty object for empty features array", () => {
        expect(computeMaxRanges({ features: [] })).toEqual({})
    })

    it("handles single feature", () => {
        const geojson = {
            features: [{ properties: { x: 99 } }],
        }
        expect(computeMaxRanges(geojson)).toEqual({ x: 99 })
    })

    it("handles negative numbers correctly", () => {
        const geojson = {
            features: [{ properties: { temp: -10 } }, { properties: { temp: -3 } }, { properties: { temp: -20 } }],
        }
        expect(computeMaxRanges(geojson)).toEqual({ temp: -3 })
    })

    it("handles mixed properties across features", () => {
        const geojson = {
            features: [{ properties: { a: 1 } }, { properties: { b: 2 } }, { properties: { a: 3, b: 1 } }],
        }
        expect(computeMaxRanges(geojson)).toEqual({ a: 3, b: 2 })
    })
})
