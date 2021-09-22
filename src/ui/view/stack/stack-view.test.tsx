// To test a React component, you need to install these modules:
// yarn add --dev react-test-renderer @types/react-test-renderer
// @see https://jestjs.io/docs/en/snapshot-testing
//
// If a test failed just because you intended to improve the component,
// just call `jest --updateSnapshot`.

import React from 'react';
import Renderer from 'react-test-renderer'
import StackView, { IStackViewProps } from './stack-view'

function view(partialProps: Partial<IStackViewProps>) {
    const props: IStackViewProps = {
        // @TODO Set default props.
        ...partialProps
    }
    return Renderer.create(<StackView {...props} />).toJSON()
}

describe('<StackView/> in ui/view', () => {
    it('should be consistent with previous snapshot', () => {
        expect(view({})).toMatchSnapshot()
    })
})
