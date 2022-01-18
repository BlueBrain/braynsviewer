import TimerMock from "./timer-mock"

describe("common/async-tools/timer-mock.ts", () => {
    describe("TimerMock.setTimeout()", () => {
        let path = ""
        function scenario(): number[] {
            const ids: number[] = []
            path = ""
            TimerMock.reset()
            ids.push(TimerMock.setTimeout(() => (path += "2"), 200))
            ids.push(TimerMock.setTimeout(() => (path += "1"), 100))
            ids.push(TimerMock.setTimeout(() => (path += "5"), 500))
            ids.push(TimerMock.setTimeout(() => (path += "3"), 300))
            ids.push(TimerMock.setTimeout(() => (path += "4"), 400))

            return ids
        }
        it("should do nothing before time", async () => {
            scenario()
            await TimerMock.run(99)
            expect(path).toEqual("")
        })
        it("should execute tasks in order", async () => {
            scenario()
            await TimerMock.run(500)
            expect(path).toEqual("12345")
        })
        it("should clearTimeout if asked", async () => {
            const [, , , id3] = scenario()
            await TimerMock.run(200)
            TimerMock.clearTimeout(id3)
            await TimerMock.run(500)
            expect(path).toEqual("1245")
        })
    })
    describe("TimerMock.setInterval()", () => {
        it("should do nothing before time", async () => {
            TimerMock.reset()
            let path = ""
            TimerMock.setInterval(() => (path = "Bad!"), 100)
            await TimerMock.run(99)
            expect(path).toEqual("")
        })
        it("should repeat itself", async () => {
            TimerMock.reset()
            let path = ""
            TimerMock.setInterval(() => (path += "*"), 100)
            await TimerMock.run(300)
            expect(path).toEqual("***")
        })
    })
})
