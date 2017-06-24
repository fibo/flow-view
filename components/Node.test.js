import React from 'react'
import Node from './Node'
import renderer from 'react-test-renderer'

it('renders correctly', () => {
  const tree = renderer
    .create(<Node fontSize={12} x={0} y={0}/>)
    .toJSON()
  expect(tree).toMatchSnapshot()
})
