import React from 'react'
import Link from 'components/Link'
import renderer from 'react-test-renderer'

it('renders correctly', () => {
  const tree = renderer
    .create(<Link x1={0} y1={0} x2={10} y2={10} />)
    .toJSON()
  expect(tree).toMatchSnapshot()
})
