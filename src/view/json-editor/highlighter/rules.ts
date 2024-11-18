import { IRule } from "./types"

const JSON5_RULES: IRule[] = [
    ["space", /^[ \t\n\r]+/],
    ["true", /^true/],
    ["false", /^false/],
    ["null", /^null/],
    // ["key", /^[_$a-z][_$a-z0-9]*[ \t\n\r]*:/i],
    // ["key", /^'([^\\']+|\\')*'[ \t\n\r]*:/],
    // ["key", /^"([^\\"]+|\\")*"[ \t\n\r]*:/],
    ["variable", /^%[_a-z][_a-z0-9]*%/i],
    ["identifier", /^[_$a-z][_$a-z0-9]*/i],
    ["comment", /^\/\/[^\n\r]*/],
    ["comment", /^\/\*([^*]+|\*[^/])\*\//],
    ["symbol", /^[(){}[\],:]/],
    ["number", /^0x[0-9a-f]+/i],
    ["number", /^[-+]?[0-9]+(\.[0-9]*)?([eE][-+]?[0-9]+)?/],
    ["number", /^[-+]?\.[0-9]*([eE][-+]?[0-9]+)?/],
    ["string", /^'([^\\']+|\\')*'/],
    ["string", /^"([^\\"]+|\\")*"/],
]

const RULES = {
    JSON5_RULES,
}

export default RULES
