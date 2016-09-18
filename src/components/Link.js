import React, { Component, PropTypes } from 'react'
import ignoreEvent from '../utils/ignoreEvent'
import defaultTheme from './theme'

class Link extends Component {
  render () {
    const {
      id,
      fill,
      from,
      onCreateLink,
      onUpdateLink,
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

    const onTargetMouseDown = (e) => {
      e.preventDefault()
      e.stopPropagation()

      onUpdateLink(id, { from, to: null })
    }

    return (
      <g
        onClick={ignoreEvent}
        onDoubleClick={ignoreEvent}
      >
        <line
          onMouseUp={selectLink}
          stroke={selected ? 'red' : fill}
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
            onMouseDown={onTargetMouseDown}
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
  id: PropTypes.string,
  fill: PropTypes.string.isRequired,
  from: PropTypes.array,
  onCreateLink: PropTypes.func.isRequired,
  onUpdateLink: PropTypes.func.isRequired,
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
  fill: 'gray',
  onCreateLink: Function.prototype,
  onUpdateLink: Function.prototype,
  pinSize: defaultTheme.pinSize,
  selected: false,
  selectLink: Function.prototype,
  width: defaultTheme.lineWidth
}

export default Link
