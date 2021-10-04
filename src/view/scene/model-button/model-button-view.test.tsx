// To test a React component, you need to install these modules:
// yarn add --dev react-test-renderer @types/react-test-renderer
// @see https://jestjs.io/docs/en/snapshot-testing
//
// If a test failed just because you intended to improve the component,
// just call `jest --updateSnapshot`.

import React from 'react'
import Renderer from 'react-test-renderer'
import ModelButtonView, { ModelButtonViewProps } from './model-button-view'

function view(partialProps: Partial<ModelButtonViewProps>) {
    const props: ModelButtonViewProps = {
        model: {
            id: 666,
            name: "My model",
            path: "/gpfs/somewhere/in/this/huge/data/storage/BlueConfig"
        },
        ...partialProps
    }
    return Renderer.create(<ModelButtonView {...props} />).toJSON()
}

describe('<ModelButtonView/> in view/scene', () => {
    it('should be consistent with previous snapshot', () => {
        expect(view({})).toMatchSnapshot()
    })
})
