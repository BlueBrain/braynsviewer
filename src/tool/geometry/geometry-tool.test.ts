import { SizeAndPos } from "../../contract/tool/geometry"
import Geometry from "./geometry-tool"

expect.extend({
    toEqualSizeAndPos(received: any, expected: SizeAndPos) {
        const success = (msg: string) => ({
            pass: true,
            message: () => msg
        })
        const failure = (msg: string) => ({
            pass: false,
            message: () => msg
        })
        if (typeof received !== "object") {
            return failure("Expected an object { x, y, width, height }!")
        }
        const { x, y, width, height } = received
        if (typeof x !== "number") {
            return failure("Expected obj.x to be a number!")
        }
        if (typeof y !== "number") {
            return failure("Expected obj.y to be a number!")
        }
        if (typeof width !== "number") {
            return failure("Expected obj.width to be a number!")
        }
        if (typeof height !== "number") {
            return failure("Expected obj.height to be a number!")
        }
        const EPSILON = 0.1
        if (Math.abs(x - expected.x) > EPSILON) {
            return failure(`Expected obj.x to be close to ${expected.x}!`)
        }
        if (Math.abs(y - expected.y) > EPSILON) {
            return failure(`Expected obj.y to be close to ${expected.y}!`)
        }
        if (Math.abs(width - expected.width) > EPSILON) {
            return failure(`Expected obj.width to be close to ${expected.width}!`)
        }
        if (Math.abs(height - expected.height) > EPSILON) {
            return failure(`Expected obj.height to be close to ${expected.height}!`)
        }
        return success(`Expected ${JSON.stringify(received)} not to be a valid SizeAndPos!`)
    }
})

describe("common/geometry.ts", () => {
    const geom = new Geometry()
    describe("Geometry.fitToCover()", () => {
        it("should fit identical sizes", () => {
            expect(
                geom.fitToCover(
                    { width: 640, height: 480 },
                    { width: 640, height: 480 },
                    0.27
                )
            ).toEqualSizeAndPos({
                x: 0,
                y: 0,
                width: 640,
                height: 480
            })
        })
        it("should fit same ratio but smaller size", () => {
            expect(
                geom.fitToCover(
                    { width: 320, height: 240 },
                    { width: 640, height: 480 },
                    0.27
                )
            ).toEqualSizeAndPos({
                x: 0,
                y: 0,
                width: 640,
                height: 480
            })
        })
        it("should fit same ratio but bigger size", () => {
            expect(
                geom.fitToCover(
                    { width: 3200, height: 2400 },
                    { width: 640, height: 480 },
                    0.27
                )
            ).toEqualSizeAndPos({
                x: 0,
                y: 0,
                width: 640,
                height: 480
            })
        })
        it("should fit big square ratio in landscape", () => {
            expect(
                geom.fitToCover(
                    { width: 1000, height: 1000 },
                    { width: 640, height: 480 },
                    0.5
                )
            ).toEqualSizeAndPos({
                x: 0,
                y: -80,
                width: 640,
                height: 640
            })
        })
        it("should fit small square ratio in landscape", () => {
            expect(
                geom.fitToCover(
                    { width: 100, height: 100 },
                    { width: 640, height: 480 },
                    0.5
                )
            ).toEqualSizeAndPos({
                x: 0,
                y: -80,
                width: 640,
                height: 640
            })
        })
        it("should fit big square ratio in portrait", () => {
            expect(
                geom.fitToCover(
                    { width: 1000, height: 1000 },
                    { width: 480, height: 640 },
                    0.5
                )
            ).toEqualSizeAndPos({
                x: -80,
                y: 0,
                width: 640,
                height: 640
            })
        })
        it("should fit small square ratio in portrait", () => {
            expect(
                geom.fitToCover(
                    { width: 100, height: 100 },
                    { width: 480, height: 640 },
                    0.5
                )
            ).toEqualSizeAndPos({
                x: -80,
                y: 0,
                width: 640,
                height: 640
            })
        })
    })
})
