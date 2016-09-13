import React, { Component, PropTypes } from 'react'

const hidden = { display: 'none', overflow: 'hidden' }
const visible = { display: 'inline', overflow: 'visible' }

class Selector extends Component {
  render () {
    const {
      addNode,
      height,
      show,
      width,
      x,
      y
    } = this.props

    return (
      <foreignObject
        height={height}
        style={(show ? visible : hidden)}
        width={width}
        x={x}
        y={y}
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
  }
}

Selector.propTypes = {
  addNode: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired
}

Selector.defaultProps = {
  height: 20,
  width: 200
}

export default Selector
