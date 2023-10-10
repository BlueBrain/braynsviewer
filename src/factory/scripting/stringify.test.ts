import { flattenCode } from "./stringify"

describe("factory/scripting/stringify.ts", () => {
    describe("flattenCode()", () => {
        it("should flatten complex trees", () => {
            const got = flattenCode([
                ["Hello", [["world"], ["of", "madness"]]],
                [["!"]],
            ])
            const exp = ["Hello", ["world", "of", "madness"], "!"]
            expect(JSON.stringify(got)).toEqual(JSON.stringify(exp))
        })
    })
})
