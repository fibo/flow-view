import React, { PropTypes } from 'react'
import focusTarget from '../../utils/focusTarget'

const NumOuts = ({ setNum, value }) => (
  <foreignObject
    x={-50}
    y={20}
    width={40}
    height={20}
  >
    <input
      type='number'
      min={0}
      step={1}
      value={value}
      style={{
        width: 40
      }}
      onClick={focusTarget}
      onChange={setNum}
    />
  </foreignObject>
)

NumOuts.PropTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired
}

export default NumOuts
