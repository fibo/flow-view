import React, { PropTypes } from 'react'
import focusTarget from '../../util/focusTarget'

const NumIns = ({ setNum, value }) => (
  <foreignObject
    x={-50}
    y={0}
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

NumIns.PropTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired
}

export default NumIns
