import React, { PropTypes } from 'react'
import ignoreEvent from '../util/ignoreEvent'

const NodeSelector = ({
  x, y,
  text,
  show,
  addNode,
  changeText
}) => {
  if (!show) return null

  return (
  <foreignObject
    x={x}
    y={y}
    width={120}
    height={20}
    onClick={ignoreEvent}
  >
    <input
      type='text'
      value={text}
      onChange={changeText}
      onKeyPress={(e) => {
        if (e.key === 'Enter') {
          addNode({x, y, text: e.target.value})
        }
      }}
      ref={(input) => { if (input !== null) input.focus() }}
    />
  </foreignObject>
  )
}

NodeSelector.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number
}

export default NodeSelector
