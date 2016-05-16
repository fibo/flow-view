'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _redux = require('redux');

var _nodes = require('./nodes');

var _nodes2 = _interopRequireDefault(_nodes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var flowViewApp = (0, _redux.combineReducers)({
  nodes: _nodes2.default
});

exports.default = flowViewApp;