// To test a React component, you need to install these modules:
// yarn add --dev react-test-renderer @types/react-test-renderer
// @see https://jestjs.io/docs/en/snapshot-testing
//
// If a test failed just because you intended to improve the component,
// just call `jest --updateSnapshot`.

import { LoaderDefinition } from "@/contract/service/loaders"
import React from "react"
import Renderer from "react-test-renderer"
import LoaderButtonView, { LoaderButtonViewProps } from "./loader-button-view"

function view(partialProps: Partial<LoaderButtonViewProps>) {
    const props: LoaderButtonViewProps = {
        value: {
            name: "mesh",
            extensions: [".obj", ".blend"],
            properties: [],
        },
        onClick() {},
        ...partialProps,
    }
    return Renderer.create(<LoaderButtonView {...props} />).toJSON()
}

describe("<LoaderButtonView/> in view/loaders", () => {
    it("should be consistent with previous snapshot", () => {
        expect(view({})).toMatchSnapshot()
    })
})
