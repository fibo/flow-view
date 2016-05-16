'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _actions = require('../actions');

var _state = require('../default/state.js');

var _state2 = _interopRequireDefault(_state);

var _Node = require('../model/Node');

var _Node2 = _interopRequireDefault(_Node);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var nodes = function nodes() {
  var state = arguments.length <= 0 || arguments[0] === undefined ? _state2.default : arguments[0];
  var action = arguments[1];

  switch (action.type) {
    case _actions.ADD_NODE:
      var nextState = Object.assign({}, state);

      var node = new _Node2.default(action.data);

      nextState.node[node.id] = node.getData();

      return nextState;
    default:
      return state;
  }
};

exports.default = nodes;