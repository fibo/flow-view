'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
  var onClick = _ref.onClick;
  var selected = _ref.selected;

  var transform = 'matrix(1,0,0,1,' + x + ',' + y + ')';

  var xCoordinateOfPin = function xCoordinateOfPin(pins, position) {
    if (position === 0) return 0;

    var numPins = pins.length;

    if (numPins > 1) return position * (width - pinSize) / (numPins - 1);
  };

  var highlighted = {
    stroke: 'rgb(0,0,0)',
    'stroke-width': 2
  };

  return _react2.default.createElement(
    'g',
    {
      onClick: onClick,
      transform: transform
    },
    _react2.default.createElement('rect', {
      width: width,
      height: height,
      fill: fill.box,
      style: selected ? highlighted : undefined
    }),
    _react2.default.createElement(
      'text',
      { x: pinSize, y: pinSize * 2 },
      _react2.default.createElement(
        'tspan',
        null,
        text
      )
    ),
    ins.map(function (pin, i, array) {
      return _react2.default.createElement('rect', { key: i,
        x: xCoordinateOfPin(ins, i),
        y: 0,
        width: pinSize,
        height: pinSize,
        fill: fill.pin
      });
    }),
    outs.map(function (pin, i) {
      return _react2.default.createElement('rect', { key: i,
        x: xCoordinateOfPin(outs, i),
        y: height - pinSize,
        width: pinSize,
        height: pinSize,
        fill: fill.pin
      });
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
  outs: _react.PropTypes.array.isRequired,
  onClick: _react.PropTypes.func.isRequired,
  selected: _react.PropTypes.bool.isRequired
};

Node.defaultProps = {
  fill: {
    box: '#cccccc',
    pin: '#333333'
  },
  pinSize: 10,
  height: 40,
  selected: false
};

exports.default = Node;