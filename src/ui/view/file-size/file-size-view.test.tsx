// To test a React component, you need to install these modules:
// yarn add --dev react-test-renderer @types/react-test-renderer
// @see https://jestjs.io/docs/en/snapshot-testing
//
// If a test failed just because you intended to improve the component,
// just call `jest --updateSnapshot`.

import React from "react"
import Renderer from "react-test-renderer"
import FileSizeView, { FileSizeViewProps } from "./file-size-view"

function view(partialProps: Partial<FileSizeViewProps>) {
    const props: FileSizeViewProps = {
        value: 99999,
        ...partialProps,
    }
    return Renderer.create(<FileSizeView {...props} />).toJSON()
}

describe("<FileSizeView/> in ui/view", () => {
    it("should be consistent with previous snapshot", () => {
        expect(view({})).toMatchSnapshot()
    })
})
