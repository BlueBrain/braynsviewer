import { formatValueAsPythonObject } from "./format"

describe("factory/scripting/format.ts", () => {
    describe("formatValue()", () => {
        it(`should format true`, () => {
            expect(formatValueAsPythonObject(true)).toEqual("True")
        })
        it(`should format false`, () => {
            expect(formatValueAsPythonObject(false)).toEqual("False")
        })
        it(`should format null`, () => {
            expect(formatValueAsPythonObject(null)).toEqual("None")
        })
        it("should format a complex value for Python", () => {
            const got = formatValueAsPythonObject({
                visible: true,
                edible: false,
                colors: {
                    foreground: [1, 0.5, 0],
                    background: [0, 0.5, 1],
                    special: null,
                },
                names: ["Yo", "man"],
            })
            const exp = [
                "{",
                [
                    '"visible": True,',
                    '"edible": False,',
                    '"colors": {',
                    [
                        '"foreground": [1,0.5,0],',
                        '"background": [0,0.5,1],',
                        '"special": None',
                    ],
                    "},",
                    '"names": [',
                    ['"Yo",', '"man"'],
                    "]",
                ],
                "}",
            ]
            expect(got).toEqual(exp)
        })
    })
})
