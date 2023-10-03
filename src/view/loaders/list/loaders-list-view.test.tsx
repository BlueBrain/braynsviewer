// To test a React component, you need to install these modules:
// yarn add --dev react-test-renderer @types/react-test-renderer
// @see https://jestjs.io/docs/en/snapshot-testing
//
// If a test failed just because you intended to improve the component,
// just call `jest --updateSnapshot`.

import React from "react"
import Renderer from "react-test-renderer"
import LoadersServiceMock from "../../../mock/loaders-service-mock"
import LoadersListView, { LoadersListViewProps } from "./loaders-list-view"

function view(partialProps: Partial<LoadersListViewProps>) {
    const props: LoadersListViewProps = {
        loadersService: new LoadersServiceMock(),
        onSelect() {},
        ...partialProps,
    }
    return Renderer.create(<LoadersListView {...props} />).toJSON()
}

describe("<LoadersView/> in view", () => {
    it("should be consistent with previous snapshot", () => {
        expect(view({})).toMatchSnapshot()
    })
})
