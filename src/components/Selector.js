import React, { Component, PropTypes } from 'react'

const hidden = { display: 'none', overflow: 'hidden' }
const visible = { display: 'inline', overflow: 'visible' }

class Selector extends Component {
  constructor (props) {
    super(props)

    this.state = { text: '' }
  }

  render () {
    const {
      createNode,
      height,
      pointer,
      show,
      width
    } = this.props

    const text = this.state.text

    const onChange = (e) => {
      const text = e.target.value.trim()
      this.setState({ text })
    }

    const onKeyPress = (e) => {
      const text = e.target.value.trim()
      const pointer = this.props.pointer

      const pressedEnter = (e.key === 'Enter')
      const textIsNotBlank = text.length > 0

      if (pressedEnter) {
        if (textIsNotBlank) {
          createNode({
            text,
            x: pointer.x,
            y: pointer.y
          })
        }

        this.setState({ text: '' })
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
          ref={(input) => {
            if (input !== null) input.focus()
          }}
          style={{ outline: 'none' }}
          onChange={onChange}
          onKeyPress={onKeyPress}
          value={text}
        />
      </foreignObject>
    )
  }
}

Selector.propTypes = {
  createNode: PropTypes.func.isRequired,
  pointer: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired
  }),
  show: PropTypes.bool.isRequired
}

Selector.defaultProps = {
  height: 20,
  width: 200
}

export default Selector
