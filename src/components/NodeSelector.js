import React, { PropTypes } from 'react'
import ignoreEvent from '../util/ignoreEvent'

const NodeSelector = ({
  x, y,
  show,
  addNode
}) => (
  show ? (
    <foreignObject
      x={x}
      y={y}
      width={120}
      height={20}
      onClick={ignoreEvent}
    >
      <input
        type='text'
        ref={(input) => { if (input !== null) input.focus() }}
        onKeyPress={(e) => {
          const text = e.target.value.trim()

          const pressedEnter = (e.key === 'Enter')
          const textIsNotBlank = text.length > 0

          if (pressedEnter && textIsNotBlank) {
            addNode({ x, y, text })
          }
        }}
      />
    </foreignObject>
    )
  : null
)

NodeSelector.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number
}

export default NodeSelector
