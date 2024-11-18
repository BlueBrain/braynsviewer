// To test a React component, you need to install these modules:
// yarn add --dev react-test-renderer @types/react-test-renderer
// @see https://jestjs.io/docs/en/snapshot-testing
//
// If a test failed just because you intended to improve the component,
// just call `jest --updateSnapshot`.

import React from "react"
import Renderer from "react-test-renderer"
import StackView, { StackViewProps } from "./stack-view"

function view(partialProps: Partial<StackViewProps>) {
    const props: StackViewProps = {
        children: [],
        value: "Hello",
        ...partialProps,
    }
    return Renderer.create(<StackView {...props} />).toJSON()
}

describe("<StackView/> in ui/view", () => {
    it("should be consistent with previous snapshot", () => {
        expect(view({})).toMatchSnapshot()
    })
})
