'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _svgx = require('svgx');

var _Links = require('./Links');

var _Links2 = _interopRequireDefault(_Links);

var _Nodes = require('./Nodes');

var _Nodes2 = _interopRequireDefault(_Nodes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Canvas = function Canvas(_ref) {
  var height = _ref.height;
  var width = _ref.width;

  return _react2.default.createElement(
    _svgx.Svg,
    { height: height, width: width },
    _react2.default.createElement(_Nodes2.default, null),
    _react2.default.createElement(_Links2.default, null)
  );
};

Canvas.propTypes = Object.assign({}, _svgx.Svg.propTypes);

exports.default = Canvas;