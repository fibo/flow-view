import React, { Component, PropTypes } from 'react'

const hidden = { display: 'none', overflow: 'hidden' }
const visible = { display: 'inline', overflow: 'visible' }

class Selector extends Component {
  render () {
    const {
      createNode,
      height,
      pointer,
      show,
      width
    } = this.props

    const onKeyPress = (e) => {
      const text = e.target.value.trim()
      const pointer = this.props.pointer

      const pressedEnter = (e.key === 'Enter')
      const textIsNotBlank = text.length > 0

      if (pressedEnter && textIsNotBlank) {
        createNode({
          text,
          x: pointer.x,
          y: pointer.y
        })
      }
    }

    return (
      <foreignObject
        height={height}
        style={(show ? visible : hidden)}
        width={width}
        x={pointer ? pointer.x : 0}
        y={pointer ? pointer.y : 0}
      >
        <input
          type='text'
          ref={(input) => { if (input !== null) input.focus() }}
          style={{ outline: 'none' }}
          onKeyPress={onKeyPress}
        />
      </foreignObject>
    )
  }
}

Selector.propTypes = {
  createNode: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  pointer: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired
  })
}

Selector.defaultProps = {
  height: 20,
  width: 200
}

export default Selector
