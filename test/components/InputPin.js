import React from 'react'
import InputPin from 'components/InputPin'
import renderer from 'react-test-renderer'

it('renders correctly', () => {
  const tree = renderer
    .create(<InputPin fontSize={12} x={0} y={0} />)
    .toJSON()
  expect(tree).toMatchSnapshot()
})
