import React from 'react'
import MinusButton from 'components/MinusButton'
import renderer from 'react-test-renderer'

it('renders correctly', () => {
  const tree = renderer
    .create(<MinusButton color='black' size={10} />)
    .toJSON()
  expect(tree).toMatchSnapshot()
})
