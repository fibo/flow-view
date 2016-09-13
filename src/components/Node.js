import React, { PropTypes, Component } from 'react'
import ignoreEvent from '../utils/ignoreEvent'

class Node extends Component {
  getBody () {
    const {
      text
    } = this.props

    return (
      <p
        style={{pointerEvents: 'none'}}
      >
        {text}
      </p>
    )
  }

  render () {
    const {
      bodyHeight,
      fill,
      pinSize,
      selected,
      width,
      x,
      y
    } = this.props

    const body = this.getBody()

    return (
      <g
        onClick={ignoreEvent}
        onDoubleClick={ignoreEvent}
        onMouseDown={ignoreEvent}
        style={{ cursor: (selected ? 'pointer' : 'default') }}
        transform={`translate(${x},${y})`}
      >
        <rect
          fill={fill}
          height={pinSize}
          width={width}
        />
        <foreignObject
          height={bodyHeight}
          onClick={ignoreEvent}
          onDoubleClick={ignoreEvent}
          onMouseDown={ignoreEvent}
          transform={`translate(0,${pinSize})`}
          width={width}
        >
          {body}
        </foreignObject>
        <rect
          fill={fill}
          height={pinSize}
          transform={`translate(0,${pinSize + bodyHeight})`}
          width={width}
        />
      </g>
    )
  }
}

Node.propTypes = {
  bodyHeight: PropTypes.number.isRequired,
  fill: PropTypes.string.isRequired,
  ins: PropTypes.array.isRequired,
  outs: PropTypes.array.isRequired,
  pinSize: PropTypes.number.isRequired,
  selected: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired
}

Node.defaultProps = {
  bodyHeight: 20,
  fill: 'lightgray',
  ins: [],
  outs: [],
  pinSize: 10,
  selected: false,
  text: 'Node',
  width: 100
}

export default Node
