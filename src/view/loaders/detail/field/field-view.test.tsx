// To test a React component, you need to install these modules:
// yarn add --dev react-test-renderer @types/react-test-renderer
// @see https://jestjs.io/docs/en/snapshot-testing
//
// If a test failed just because you intended to improve the component,
// just call `jest --updateSnapshot`.

import React from 'react'
import Renderer from 'react-test-renderer'
import FieldView, { FieldViewProps } from './field-view'

function view(partialProps: Partial<FieldViewProps>) {
    const props: FieldViewProps = {
        values: { radius: 3.14 },
        onChange() { },
        property: {
            name: "radius",
            title: "Radius (in mm)",
            defaultValue: 1.618,
            type: "number"
        },
        ...partialProps
    }
    return Renderer.create(<FieldView {...props} />).toJSON()
}

describe('<FieldView/> in view/loaders/detail', () => {
    it('should be consistent with previous snapshot', () => {
        expect(view({})).toMatchSnapshot()
    })
})
