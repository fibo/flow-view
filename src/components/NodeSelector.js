import React, { PropTypes } from 'react'
import ignoreEvent from '../util/ignoreEvent'

const NodeSelector = ({
  x, y,
  show,
  text,
  changeText
}) => (
  show
  ? (
    <foreignObject
      x={x}
      y={y}
      width={120}
      height={20}
      onClick={ignoreEvent}
    >
      <input
        onChange={changeText}
        type='text'
        value={text}
        ref={(input) => { if (input !== null) input.focus() }}
      />
    </foreignObject>
  )
  : null
)

NodeSelector.propTypes = {
  show: PropTypes.bool.isRequired,
  x: PropTypes.number,
  y: PropTypes.number
}

export default NodeSelector
