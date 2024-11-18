import Rules from "./rules"
import { tokenize } from "./tokenizer"

describe(`web-brayns/manager/syntax-highlighter/rules`, () => {
    describe(`JSON5`, () => {
        function check(content: string, expected: string[]) {
            it(`should tokenize "${content}" as expected`, () => {
                const tokens = tokenize(content, Rules.JSON5_RULES)
                const classNames = tokens.map((tkn) => tkn.className)
                expect(classNames).toEqual(expected)
            })
        }

        check(`"Advanced circuit loader (Experimental)"`, ["string"])
        check("3.14", ["number"])
        check("0xff", ["number"])
        check("%VARIABLE%", ["variable"])
        check("5,8", ["number", "symbol", "number"])
        check("''null", ["string", "null"])
        check("true", ["true"])
        check("false", ["false"])
        check("identifier", ["identifier"])
        check('""', ["string"])
        check('"C\\"est"', ["string"])
        check("'C\\'est'", ["string"])
        check("[]", ["symbol", "symbol"])
        check("[[]]", ["symbol", "symbol", "symbol", "symbol"])
        check("[1,2]", ["symbol", "number", "symbol", "number", "symbol"])
        check("[1,   2]", [
            "symbol",
            "number",
            "symbol",
            "space",
            "number",
            "symbol",
        ])
        check("[1,'hello']", ["symbol", "number", "symbol", "string", "symbol"])
    })
})
