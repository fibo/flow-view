'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _xCoordinateOfPin = require('../geometry/xCoordinateOfPin');

var _xCoordinateOfPin2 = _interopRequireDefault(_xCoordinateOfPin);

var _ignoreEvent = require('../util/ignoreEvent');

var _ignoreEvent2 = _interopRequireDefault(_ignoreEvent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var highlighted = {
  stroke: 'rgb(0,0,0)',
  strokeWidth: 1
};

var Node = function Node(_ref) {
  var x = _ref.x;
  var y = _ref.y;
  var width = _ref.width;
  var height = _ref.height;
  var fill = _ref.fill;
  var text = _ref.text;
  var pinSize = _ref.pinSize;
  var ins = _ref.ins;
  var outs = _ref.outs;
  var dragged = _ref.dragged;
  var dragItems = _ref.dragItems;
  var createLink = _ref.createLink;
  var selectNode = _ref.selectNode;
  var selected = _ref.selected;
  var endDragging = _ref.endDragging;
  return _react2.default.createElement(
    'g',
    {
      onClick: _ignoreEvent2.default,
      onMouseDown: selectNode,
      onMouseUp: endDragging,
      onMouseLeave: endDragging,
      onMouseMove: dragged ? dragItems : undefined,
      transform: 'matrix(1,0,0,1,' + x + ',' + y + ')',
      style: {
        cursor: selected ? 'pointer' : 'default'
      }
    },
    _react2.default.createElement('rect', {
      width: width,
      height: height,
      fill: fill.box,
      style: selected ? highlighted : undefined
    }),
    _react2.default.createElement(
      'text',
      {
        x: pinSize,
        y: pinSize * 2,
        style: { pointerEvents: 'none' }
      },
      _react2.default.createElement(
        'tspan',
        null,
        text
      )
    ),
    ins.map(function (pin, i, array) {
      return _react2.default.createElement('rect', _extends({ key: i,
        onMouseDown: _ignoreEvent2.default,
        onMouseMove: _ignoreEvent2.default,
        onMouseUp: _ignoreEvent2.default,
        fill: fill.pin
      }, pin));
    }),
    outs.map(function (pin, i) {
      return _react2.default.createElement('rect', _extends({
        key: i,
        x: (0, _xCoordinateOfPin2.default)(pinSize, width, outs.length, i),
        y: height - pinSize,
        onMouseDown: _ignoreEvent2.default,
        onMouseMove: _ignoreEvent2.default,
        onMouseUp: _ignoreEvent2.default,
        fill: fill.pin
      }, pin));
    })
  );
};

Node.propTypes = {
  x: _react.PropTypes.number.isRequired,
  y: _react.PropTypes.number.isRequired,
  width: _react.PropTypes.number.isRequired,
  height: _react.PropTypes.number.isRequired,
  pinSize: _react.PropTypes.number.isRequired,
  text: _react.PropTypes.string.isRequired,
  fill: _react.PropTypes.shape({
    box: _react.PropTypes.string.isRequired,
    pin: _react.PropTypes.string.isRequired
  }),
  ins: _react.PropTypes.array.isRequired,
  dragged: _react.PropTypes.bool.isRequired,
  outs: _react.PropTypes.array.isRequired,
  selectNode: _react.PropTypes.func.isRequired,
  endDragging: _react.PropTypes.func.isRequired,
  dragItems: _react.PropTypes.func.isRequired,
  selected: _react.PropTypes.bool.isRequired,
  createLink: _react.PropTypes.func.isRequired
};

Node.defaultProps = {
  fill: {
    box: '#cccccc',
    pin: '#333333'
  },
  selected: false
};

exports.default = Node;