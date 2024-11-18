// To test a React component, you need to install these modules:
// yarn add --dev react-test-renderer @types/react-test-renderer
// @see https://jestjs.io/docs/en/snapshot-testing
//
// If a test failed just because you intended to improve the component,
// just call `jest --updateSnapshot`.

import React from "react"
import Renderer from "react-test-renderer"
import SurfaceView, { SurfaceViewProps } from "./surface-view"

function view(partialProps: Partial<SurfaceViewProps>) {
    const props: SurfaceViewProps = {
        children: [],
        ...partialProps,
    }
    return Renderer.create(<SurfaceView {...props} />).toJSON()
}

describe("<SurfaceView/> in ui/view", () => {
    it("should be consistent with previous snapshot", () => {
        expect(view({})).toMatchSnapshot()
    })
})
