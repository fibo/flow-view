'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _notDefined = require('not-defined');

var _notDefined2 = _interopRequireDefault(_notDefined);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var invalid = function invalid(data) {
  throw new TypeError('Invalid data', data);
};

var Node = function Node(data) {
  if ((0, _notDefined2.default)(data.ins)) invalid(data);
  if ((0, _notDefined2.default)(data.outs)) invalid(data);
};

var Link = function Link(data) {
  if ((0, _notDefined2.default)(data.from)) invalid(data);
  if ((0, _notDefined2.default)(data.to)) invalid(data);
};

exports.default = { Node: Node, Link: Link };