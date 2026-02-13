import { describe, expect, it } from "vitest"
import { buildAttributes } from "~/hooks/use-popup-data"

describe("buildAttributes", () => {
    it("returns highlight attribute with 'победил/подавался' when applications and winners present", () => {
        const properties = {
            подавался: "10",
            победители: "5",
        }
        const result = buildAttributes(properties, [], "подавался", "победители", "доля побед")

        const highlight = result.find((a) => a.key === "победил/подавался")
        expect(highlight).toBeDefined()
        expect(highlight!.value).toBe("5 / 10")
        expect(highlight!.highlight).toBe(true)
    })

    it("returns highlight attribute when only applications present (winners defaults to 0)", () => {
        const properties = {
            подавался: "8",
        }
        const result = buildAttributes(properties, [], "подавался", "победители", "доля побед")

        const highlight = result.find((a) => a.key === "победил/подавался")
        expect(highlight).toBeDefined()
        expect(highlight!.value).toBe("0 / 8")
    })

    it("returns highlight attribute when only winners present (applications defaults to 0)", () => {
        const properties = {
            победители: "3",
        }
        const result = buildAttributes(properties, [], "подавался", "победители", "доля побед")

        const highlight = result.find((a) => a.key === "победил/подавался")
        expect(highlight).toBeDefined()
        expect(highlight!.value).toBe("3 / 0")
    })

    it("includes win rate attribute when present", () => {
        const properties = {
            "доля побед": "0.5",
        }
        const result = buildAttributes(properties, [], "подавался", "победители", "доля побед")

        const winRate = result.find((a) => a.key === "доля побед")
        expect(winRate).toBeDefined()
        expect(winRate!.value).toBe("0.5")
        expect(winRate!.highlight).toBe(true)
    })

    it("formats contest entries as 'победа / подача'", () => {
        const properties = {
            "2020_подача": "да",
            "2020_победа": "нет",
        }
        const excludedKeys = ["2020_подача", "2020_победа"]
        const result = buildAttributes(properties, excludedKeys, "подавался", "победители", "доля побед")

        const contest = result.find((a) => a.key === "2020")
        expect(contest).toBeDefined()
        expect(contest!.value).toBe("нет / да")
    })

    it("includes remaining (non-excluded) properties as plain attributes", () => {
        const properties = {
            extra1: "value1",
            extra2: "value2",
            excluded: "hidden",
        }
        const result = buildAttributes(properties, ["excluded"], "подавался", "победители", "доля побед")

        const extra1 = result.find((a) => a.key === "extra1")
        const extra2 = result.find((a) => a.key === "extra2")
        const excluded = result.find((a) => a.key === "excluded")

        expect(extra1).toBeDefined()
        expect(extra1!.value).toBe("value1")
        expect(extra1!.highlight).toBeUndefined()

        expect(extra2).toBeDefined()
        expect(extra2!.value).toBe("value2")

        expect(excluded).toBeUndefined()
    })

    it("handles missing/null values gracefully", () => {
        const properties = {} as Record<string, string>
        const result = buildAttributes(properties, [], "подавался", "победители", "доля побед")

        expect(result).toEqual([])
    })

    it("does not include highlight attribute when neither applications nor winners are present", () => {
        const properties = {
            other: "value",
        }
        const result = buildAttributes(properties, [], "подавался", "победители", "доля побед")

        const highlight = result.find((a) => a.key === "победил/подавался")
        expect(highlight).toBeUndefined()
    })

    it("uses dash placeholder in contest entry when only подача is present", () => {
        const properties = {
            "2020_подача": "да",
        }
        const result = buildAttributes(properties, ["2020_подача"], "подавался", "победители", "доля побед")

        const contest = result.find((a) => a.key === "2020")
        expect(contest).toBeDefined()
        expect(contest!.value).toBe("— / да")
    })

    it("uses dash placeholder in contest entry when only победа is present", () => {
        const properties = {
            "2020_победа": "нет",
        }
        const result = buildAttributes(properties, ["2020_победа"], "подавался", "победители", "доля побед")

        const contest = result.find((a) => a.key === "2020")
        expect(contest).toBeDefined()
        expect(contest!.value).toBe("нет / —")
    })
})
