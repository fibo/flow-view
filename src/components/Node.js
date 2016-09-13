import React, { PropTypes, Component } from 'react'

class Node extends Component {
  getBody () {
    const {
      text
    } = this.props

    return (
      <p>{text}</p>
    )
  }

  render () {
    const {
      bodyHeight,
      fill,
      pinSize,
      width,
      x,
      y
    } = this.props

    const body = this.getBody()

    const outputPinsY = pinSize + bodyHeight

    return (
      <g
        transform={`translate(${x},${y})`}
      >
        <rect
          fill={fill}
          height={pinSize}
          width={width}
        />
        <foreignObject
          width={width}
          height={bodyHeight}
        >
          {body}
        </foreignObject>
        <rect
          fill={fill}
          height={pinSize}
          transform={`translate(0,${outputPinsY})`}
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
  text: PropTypes.string.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired
}

Node.defaultProps = {
  bodyHeight: 20,
  fill: 'ghostwhite',
  ins: [],
  outs: [],
  pinSize: 10,
  text: 'Node',
  width: 100
}

export default Node
