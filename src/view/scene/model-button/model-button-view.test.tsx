// To test a React component, you need to install these modules:
// yarn add --dev react-test-renderer @types/react-test-renderer
// @see https://jestjs.io/docs/en/snapshot-testing
//
// If a test failed just because you intended to improve the component,
// just call `jest --updateSnapshot`.

import React from 'react';
import Renderer from 'react-test-renderer'
import ModelButtonView, { IModelButtonViewProps } from './model-button-view'

function view(partialProps: Partial<IModelButtonViewProps>) {
    const props: IModelButtonViewProps = {
        // @TODO Set default props.
        ...partialProps
    }
    return Renderer.create(<ModelButtonView {...props} />).toJSON()
}

describe('<ModelButtonView/> in view/scene', () => {
    it('should be consistent with previous snapshot', () => {
        expect(view({})).toMatchSnapshot()
    })
})
