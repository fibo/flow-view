import React, { Component, PropTypes } from 'react'
import ignoreEvent from '../utils/ignoreEvent'
import defaultTheme from './theme'

class Link extends Component {
  render () {
    const {
      deleteLink,
      fill,
      from,
      onCreateLink,
      pinSize,
      selected,
      selectLink,
      to,
      width,
      x1,
      y1,
      x2,
      y2
    } = this.props

    const onSourceMouseDown = (e) => {
      e.preventDefault()
      e.stopPropagation()

      onCreateLink({ from, to: null })
    }

    return (
      <g
        onClick={() => {console.log('click')}}
      >
        <line
          stroke={fill}
          strokeWidth={width}
          x1={x1 + pinSize / 2}
          y1={y1 + pinSize / 2}
          x2={x2 + pinSize / 2}
          y2={y2 + pinSize / 2}
        />
        <rect
          fill={fill}
          height={pinSize}
          onMouseDown={onSourceMouseDown}
          width={pinSize}
          x={x1}
          y={y1}
        />
        {to ? (
          <rect
            fill={fill}
            height={pinSize}
            width={pinSize}
            x={x2}
            y={y2}
          />
        ) : null}
      </g>
    )
  }
}

Link.propTypes = {
  deleteLink: PropTypes.func.isRequired,
  fill: PropTypes.string.isRequired,
  from: PropTypes.array,
  onCreateLink: PropTypes.func.isRequired,
  pinSize: PropTypes.number.isRequired,
  selected: PropTypes.bool.isRequired,
  selectLink: PropTypes.func.isRequired,
  to: PropTypes.array,
  width: PropTypes.number.isRequired,
  x1: PropTypes.number.isRequired,
  y1: PropTypes.number.isRequired,
  x2: PropTypes.number.isRequired,
  y2: PropTypes.number.isRequired
}

Link.defaultProps = {
  deleteLink: Function.prototype,
  fill: 'gray',
  onCreateLink: Function.prototype,
  pinSize: defaultTheme.pinSize,
  selected: false,
  selectLink: Function.prototype,
  width: defaultTheme.lineWidth
}

export default Link
