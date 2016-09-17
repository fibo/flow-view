import React, { PropTypes } from 'react'
import ignoreEvent from '../utils/ignoreEvent'
import theme from './theme'

const stroke = '#333333'

const Link = ({
  deleteLink,
  selected,
  selectLink,
  width,
  x1,
  y1,
  x2,
  y2
}) => (
  <g
    onClick={selected ? undefined : selectLink}
    onDoubleClick={selected ? deleteLink : undefined}
    onMouseDown={ignoreEvent}
  >
    <circle
      cx={x1}
      cy={y1}
      r={width}
    />
    <line
      x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={stroke}
      strokeWidth={width}
    />
    <circle
      cx={x2}
      cy={y2}
      r={width}
    />
  </g>
)

Link.propTypes = {
  deleteLink: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired,
  selectLink: PropTypes.func.isRequired,
  width: PropTypes.number.isRequired,
  x1: PropTypes.number.isRequired,
  y1: PropTypes.number.isRequired,
  x2: PropTypes.number.isRequired,
  y2: PropTypes.number.isRequired
}

Link.defaultProps = {
  deleteLink: Function.prototype,
  selected: false,
  selectLink: Function.prototype,
  width: theme.lineWidth
}

export default Link
