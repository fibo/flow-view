import React, { PropTypes } from 'react'

const hidden = {display: 'none', overflow: 'hidden'}
const visible = {display: 'inline', overflow: 'visible'}

const NodeSelector = ({
  addNode,
  show,
  x,
  y
}) => (
  <foreignObject
    style={(show ? visible : hidden)}
    x={x}
    y={y}
    width={200}
    height={20}
  >
    <input
      type='text'
      ref={(input) => { if (input !== null) input.focus() }}
      style={{ outline: 'none' }}
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

NodeSelector.propTypes = {
  addNode: PropTypes.func,
  show: PropTypes.bool,
  x: PropTypes.number,
  y: PropTypes.number
}

export default NodeSelector
