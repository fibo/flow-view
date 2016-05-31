'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Link = require('./Link');

var _Link2 = _interopRequireDefault(_Link);

var _Node = require('./Node');

var _Node2 = _interopRequireDefault(_Node);

var _svgx = require('svgx');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Canvas = function Canvas(_ref) {
  var nodes = _ref.nodes;
  var links = _ref.links;
  var height = _ref.height;
  var width = _ref.width;
  var onClickNode = _ref.onClickNode;

  var toLink = function toLink(link) {
    return _react2.default.createElement(_Link2.default, _extends({ key: link.id }, link));
  };

  return _react2.default.createElement(
    _svgx.Svg,
    { height: height, width: width },
    nodes.map(function (node, i) {
      return _react2.default.createElement(_Node2.default, _extends({
        key: i,
        onClick: onClickNode(node.id)
      }, node));
    }),
    links.map(toLink)
  );
};

Canvas.propTypes = Object.assign({
  links: _react.PropTypes.array.isRequired,
  nodes: _react.PropTypes.array.isRequired
}, _svgx.Svg.propTypes);

exports.default = Canvas;