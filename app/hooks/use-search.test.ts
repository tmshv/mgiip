import { describe, expect, it } from "vitest"
import { fuzzyMatch } from "~/hooks/use-search"

describe("fuzzyMatch", () => {
    it("returns null when query chars are not found in text", () => {
        expect(fuzzyMatch("xyz", "hello")).toBeNull()
        expect(fuzzyMatch("abc", "def")).toBeNull()
    })

    it("returns null when query chars appear but not in sequence", () => {
        expect(fuzzyMatch("ba", "abc")).toBeNull()
    })

    it("returns a score (not null) for valid matches", () => {
        expect(fuzzyMatch("hel", "hello")).not.toBeNull()
        expect(fuzzyMatch("hlo", "hello")).not.toBeNull()
        expect(typeof fuzzyMatch("abc", "abcdef")).toBe("number")
    })

    it("gives higher score to prefix matches (query at start of text)", () => {
        const prefixScore = fuzzyMatch("ab", "abcdef")!
        const nonPrefixScore = fuzzyMatch("ab", "xabcdef")!
        expect(prefixScore).toBeGreaterThan(nonPrefixScore)
    })

    it("gives higher score to consecutive character matches", () => {
        const consecutiveScore = fuzzyMatch("abc", "abcxyz")!
        const gappedScore = fuzzyMatch("abc", "axbxcxyz")!
        expect(consecutiveScore).toBeGreaterThan(gappedScore)
    })

    it("penalizes gaps between matched characters", () => {
        const noGap = fuzzyMatch("ab", "abx")!
        const smallGap = fuzzyMatch("ab", "axbx")!
        const largeGap = fuzzyMatch("ab", "axxxxbx")!
        expect(noGap).toBeGreaterThan(smallGap)
        expect(smallGap).toBeGreaterThan(largeGap)
    })

    it("gives higher score to shorter texts (closer match density)", () => {
        const shortScore = fuzzyMatch("ab", "ab")!
        const longScore = fuzzyMatch("ab", `ab${"x".repeat(50)}`)!
        expect(shortScore).toBeGreaterThan(longScore)
    })

    it("is case-insensitive", () => {
        expect(fuzzyMatch("ABC", "abcdef")).not.toBeNull()
        expect(fuzzyMatch("abc", "ABCDEF")).not.toBeNull()
        expect(fuzzyMatch("ABC", "abcdef")).toBe(fuzzyMatch("abc", "ABCDEF"))
    })

    it("handles empty query", () => {
        const score = fuzzyMatch("", "hello")
        expect(score).not.toBeNull()
        expect(typeof score).toBe("number")
    })

    it("handles empty text", () => {
        expect(fuzzyMatch("a", "")).toBeNull()
    })

    it("handles both empty query and empty text", () => {
        const score = fuzzyMatch("", "")
        expect(score).not.toBeNull()
    })
})
