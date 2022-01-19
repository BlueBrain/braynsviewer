// To test a React component, you need to install these modules:
// yarn add --dev react-test-renderer @types/react-test-renderer
// @see https://jestjs.io/docs/en/snapshot-testing
//
// If a test failed just because you intended to improve the component,
// just call `jest --updateSnapshot`.

import React from "react"
import Renderer from "react-test-renderer"
import LoadersServiceInterface, {
    LoaderDefinition,
} from "../../contract/service/loaders"
import LoadersServiceMock from "../../mock/loaders-service-mock"
import LoadersView, { LoadersViewProps } from "./loaders-view"

function view(partialProps: Partial<LoadersViewProps>) {
    const props: LoadersViewProps = {
        loadersService: new LoadersServiceMock(),
        ...partialProps,
    }
    return Renderer.create(<LoadersView {...props} />).toJSON()
}

describe("<LoadersView/> in view", () => {
    it("should be consistent with previous snapshot", () => {
        expect(view({})).toMatchSnapshot()
    })
})
