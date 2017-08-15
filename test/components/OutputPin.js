import React from 'react'
import OutputPin from 'components/OutputPin'
import renderer from 'react-test-renderer'

it('renders correctly', () => {
  const tree = renderer
    .create(<OutputPin fontSize={12} x={0} y={0} />)
    .toJSON()
  expect(tree).toMatchSnapshot()
})
