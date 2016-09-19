import React, { Component, PropTypes } from 'react'

class Inspector extends Component {
  render () {
    const {
      height,
      selectedItems,
      width,
      x,
      y
    } = this.props

    return (
      <foreignObject
        height={height}
        width={width}
        x={x}
        y={y}
      >
        <p>Halo inspektor</p>
        <p>items {selectedItems}</p>
      </foreignObject>
    )
  }
}

Inspector.propTypes = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired
}

Inspector.defaultProps = {
  width: 200,
  x: 0,
  y: 0
}

export default Inspector
