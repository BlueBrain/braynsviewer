// To test a React component, you need to install these modules:
// yarn add --dev react-test-renderer @types/react-test-renderer
// @see https://jestjs.io/docs/en/snapshot-testing
//
// If a test failed just because you intended to improve the component,
// just call `jest --updateSnapshot`.

import LoaderServiceMock from '@/mock/loaders-service-mock'
import React from 'react'
import Renderer from 'react-test-renderer'
import LoaderDetailView, { LoaderDetailViewProps } from './loader-detail-view'

function view(partialProps: Partial<LoaderDetailViewProps>) {
    const props: LoaderDetailViewProps = {
        loadersService: new LoaderServiceMock(),
        onBack() { },
        ...partialProps
    }
    return Renderer.create(<LoaderDetailView {...props} />).toJSON()
}

describe('<LoaderDetailView/> in view/loaders', () => {
    it('should be consistent with previous snapshot', () => {
        expect(view({})).toMatchSnapshot()
    })
})
