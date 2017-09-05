import React from 'react'
import CrossButton from 'components/CrossButton'
import renderer from 'react-test-renderer'

it('renders correctly', () => {
  const tree = renderer
    .create(<CrossButton color='black' size={10} />)
    .toJSON()
  expect(tree).toMatchSnapshot()
})
