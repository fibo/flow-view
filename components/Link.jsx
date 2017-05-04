var inherits = require('inherits')
var PropTypes = require('prop-types')
var React = require('react')

var Component = React.Component

var ignoreEvent = require('../utils/ignoreEvent')
var theme = require('./theme')

function Link () {
  Component.apply(this, arguments)
}

inherits(Link, Component)

function render () {
  var {
    id,
    deleteLink,
    from,
    onCreateLink,
    startDraggingLinkTarget,
    selected,
    selectLink,
    sourceSelected,
    targetSelected,
    theme,
    to,
    x1,
    y1,
    x2,
    y2
  } = this.props

  var {
    darkPrimaryColor,
    primaryColor,
    linkColor,
    lineWidth,
    pinSize
  } = theme

  var onSourceMouseDown = (e) => {
    e.preventDefault()
    e.stopPropagation()

    onCreateLink({ from, to: null })
  }

  var onTargetMouseDown = (e) => {
    e.preventDefault()
    e.stopPropagation()

    startDraggingLinkTarget(id)
  }

  var startX = x1 + (pinSize / 2)
  var startY = y1 + (pinSize / 2)
  var endX = x2 + (pinSize / 2)
  var endY = y2 + (pinSize / 2)

  var midPointY = (startY + endY) / 2

  var controlPointX1 = startX
  var controlPointY1 = to ? midPointY : startY
  var controlPointX2 = endX
  var controlPointY2 = to ? midPointY : endY

  return (
    <g
      onClick={ignoreEvent}
      onDoubleClick={ignoreEvent}
    >
      <path
        d={`M ${startX} ${startY} C ${controlPointX1} ${controlPointY1}, ${controlPointX2} ${controlPointY2} ,${endX} ${endY}`}
        fill='transparent'
        onMouseDown={() => {
          if (selected) deleteLink(id)
        }}
        onMouseUp={selectLink}
        stroke={selected ? primaryColor : linkColor}
        strokeWidth={lineWidth}
      />
      <rect
        fill={(selected || sourceSelected) ? darkPrimaryColor : linkColor}
        height={pinSize}
        onMouseDown={onSourceMouseDown}
        width={pinSize}
        x={x1}
        y={y1}
      />
      {to ? (
        <rect
          fill={(selected || targetSelected) ? darkPrimaryColor : linkColor}
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

Link.prototype.render = render

Link.propTypes = {
  deleteLink: PropTypes.func.isRequired,
  id: PropTypes.string,
  from: PropTypes.array,
  onCreateLink: PropTypes.func.isRequired,
  startDraggingLinkTarget: PropTypes.func.isRequired,
  pinSize: PropTypes.number.isRequired,
  selected: PropTypes.bool.isRequired,
  selectLink: PropTypes.func.isRequired,
  sourceSelected: PropTypes.bool.isRequired,
  targetSelected: PropTypes.bool.isRequired,
  theme: theme.propTypes,
  to: PropTypes.array,
  x1: PropTypes.number.isRequired,
  y1: PropTypes.number.isRequired,
  x2: PropTypes.number.isRequired,
  y2: PropTypes.number.isRequired
}

Link.defaultProps = {
  deleteLink: Function.prototype,
  onCreateLink: Function.prototype,
  startDraggingLinkTarget: Function.prototype,
  selected: false,
  selectLink: Function.prototype,
  sourceSelected: false,
  targetSelected: false,
  theme: theme.defaultProps
}

module.exports = exports.default = Link
