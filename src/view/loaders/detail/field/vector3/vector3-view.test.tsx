// To test a React component, you need to install these modules:
// yarn add --dev react-test-renderer @types/react-test-renderer
// @see https://jestjs.io/docs/en/snapshot-testing
//
// If a test failed just because you intended to improve the component,
// just call `jest --updateSnapshot`.

import React from "react"
import Renderer from "react-test-renderer"
import Vector3View, { Vector3ViewProps } from "./vector3-view"

function view(partialProps: Partial<Vector3ViewProps>) {
    const props: Vector3ViewProps = {
        value: [1.618, 2, 3.14],
        onChange() {},
        ...partialProps,
    }
    return Renderer.create(<Vector3View {...props} />).toJSON()
}

describe("<Vector3View/> in view/loaders/detail/field", () => {
    it("should be consistent with previous snapshot", () => {
        expect(view({})).toMatchSnapshot()
    })
})
