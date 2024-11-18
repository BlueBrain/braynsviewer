import { SizeAndPos } from "./contract/tool/geometry"

declare global {
    namespace jest {
        interface Matchers<R> {
            toEqualSizeAndPos(expected: SizeAndPos): R
        }
    }
}
