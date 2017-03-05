var React = require('react');
var inherits = require('inherits');

var Component = React.Component;
var PropTypes = React.PropTypes;

var ignoreEvent = require('../utils/ignoreEvent');
var theme = require('./theme');

function Link() {
  Component.apply(this, arguments);
}

inherits(Link, Component);

function render() {
  var _props = this.props,
      id = _props.id,
      deleteLink = _props.deleteLink,
      from = _props.from,
      onCreateLink = _props.onCreateLink,
      startDraggingLinkTarget = _props.startDraggingLinkTarget,
      selected = _props.selected,
      selectLink = _props.selectLink,
      sourceSelected = _props.sourceSelected,
      targetSelected = _props.targetSelected,
      theme = _props.theme,
      to = _props.to,
      x1 = _props.x1,
      y1 = _props.y1,
      x2 = _props.x2,
      y2 = _props.y2;
  var darkPrimaryColor = theme.darkPrimaryColor,
      primaryColor = theme.primaryColor,
      linkColor = theme.linkColor,
      lineWidth = theme.lineWidth,
      pinSize = theme.pinSize;


  var onSourceMouseDown = e => {
    e.preventDefault();
    e.stopPropagation();

    onCreateLink({ from: from, to: null });
  };

  var onTargetMouseDown = e => {
    e.preventDefault();
    e.stopPropagation();

    startDraggingLinkTarget(id);
  };

  var startX = x1 + pinSize / 2;
  var startY = y1 + pinSize / 2;
  var endX = x2 + pinSize / 2;
  var endY = y2 + pinSize / 2;

  var midPointY = (startY + endY) / 2;

  var controlPointX1 = startX;
  var controlPointY1 = to ? midPointY : startY;
  var controlPointX2 = endX;
  var controlPointY2 = to ? midPointY : endY;

  return React.createElement(
    'g',
    {
      onClick: ignoreEvent,
      onDoubleClick: ignoreEvent
    },
    React.createElement('path', {
      d: 'M ' + startX + ' ' + startY + ' C ' + controlPointX1 + ' ' + controlPointY1 + ', ' + controlPointX2 + ' ' + controlPointY2 + ' ,' + endX + ' ' + endY,
      fill: 'transparent',
      onMouseDown: () => {
        if (selected) deleteLink(id);
      },
      onMouseUp: selectLink,
      stroke: selected ? primaryColor : linkColor,
      strokeWidth: lineWidth
    }),
    React.createElement('rect', {
      fill: selected || sourceSelected ? darkPrimaryColor : linkColor,
      height: pinSize,
      onMouseDown: onSourceMouseDown,
      width: pinSize,
      x: x1,
      y: y1
    }),
    to ? React.createElement('rect', {
      fill: selected || targetSelected ? darkPrimaryColor : linkColor,
      height: pinSize,
      onMouseDown: onTargetMouseDown,
      width: pinSize,
      x: x2,
      y: y2
    }) : null
  );
}

Link.prototype.render = render;

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
};

Link.defaultProps = {
  deleteLink: Function.prototype,
  onCreateLink: Function.prototype,
  startDraggingLinkTarget: Function.prototype,
  selected: false,
  selectLink: Function.prototype,
  sourceSelected: false,
  targetSelected: false,
  theme: theme.defaultProps
};

module.exports = exports.default = Link;