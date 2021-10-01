import TimerMock from "../../mock/timer-mock"
import AsyncTools from "./async-tools"

describe("common/async-tools/async-tools.ts", () => {
    beforeEach(() => {
        TimerMock.reset()
        TimerMock.activated = true
    })
    afterEach(() => {
        TimerMock.activated = false
    })
    describe("AsyncTools.sleep()", () => {
        it("should wait 3000 ms", async () => {
            let hasResolved = false
            AsyncTools.sleep(3000).then(() => (hasResolved = true))
            await TimerMock.run(2999)
            expect(hasResolved).toEqual(false)
        })
        it("should resolve after 3000 ms", async () => {
            let hasResolved = false
            AsyncTools.sleep(3000).then(() => (hasResolved = true))
            await TimerMock.run(3000)
            expect(hasResolved).toEqual(false)
        })
    })
    describe(`"AsyncTools.debounce()`, () => {
        it(`should debounce when called twice withint delay`, async () => {
            let path = ["START"]
            const push = AsyncTools.debounce(step => path.push(step), 100)
            push("A")
            await TimerMock.run(50)
            push("B")
            await TimerMock.run(200)
            expect(path).toEqual(["START", "B"])
        })
    })
    describe(`"AsyncTools.throttle()`, () => {
        it(`should throttle every 100 ms`, async () => {
            let path: number[] = []
            const push = AsyncTools.throttle(step => path.push(step), 100)
            push(1)
            await TimerMock.run(30)
            push(2)
            await TimerMock.run(60)
            push(3)
            await TimerMock.run(90)
            push(4)
            await TimerMock.run(120)
            push(5)
            await TimerMock.run(150)
            push(6)
            await TimerMock.run(180)
            push(7)
            await TimerMock.run(210)
            push(8)
            await TimerMock.run(240)
            push(9)
            expect(path).toEqual([1, 4, 8])
        })
    })
})
