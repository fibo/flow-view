import React from 'react'
import PlusButton from 'components/PlusButton'
import renderer from 'react-test-renderer'

it('renders correctly', () => {
  const tree = renderer
    .create(<PlusButton color='black' size={10} />)
    .toJSON()
  expect(tree).toMatchSnapshot()
})
