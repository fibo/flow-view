'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _initialState = require('../initialState');

var _initialState2 = _interopRequireDefault(_initialState);

var _actions = require('../actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var nextId = 0;

var generateId = function generateId() {
  nextId++;
  return 'id' + nextId;
};

var flowViewApp = function flowViewApp() {
  var state = arguments.length <= 0 || arguments[0] === undefined ? _initialState2.default : arguments[0];
  var action = arguments[1];

  switch (action.type) {
    case _actions.ADD_NODE:
      var id = generateId();

      var node = Object.assign({}, state.node);

      node[id] = action.node;

      return Object.assign({ node: node }, state);

    case _actions.DEL_NODE:
      var nextState = Object.assign({}, state);

      var nodeid = action.id;

      delete nextState.node[nodeid];

      for (var linkid in nextState.link) {
        var isSource = nextState.link[linkid].from[0] === nodeid;
        var isTarget = nextState.link[linkid].to[0] === nodeid;

        if (isSource || isTarget) delete nextState.link[linkid];
      }

      return nextState;

    case _actions.SELECT_ITEM:
      var selectedItems = Object.assign([], state.selectedItems);
      var itemId = action.id;

      var indexOfSelectedItem = selectedItems.indexOf(itemId);
      var itemIsNotAlreadySelected = indexOfSelectedItem === -1;

      if (itemIsNotAlreadySelected) {
        selectedItems.push(itemId);
      } else {
        selectedItems.splice(indexOfSelectedItem, 1);
      }

      return Object.assign({}, state, { selectedItems: selectedItems });

    default:
      return state;
  }
};

exports.default = flowViewApp;