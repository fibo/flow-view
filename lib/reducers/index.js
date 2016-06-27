(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', '../util/xCenterOfPin', '../util/initialState', '../actions', './setNumIns', './setNumOuts'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('../util/xCenterOfPin'), require('../util/initialState'), require('../actions'), require('./setNumIns'), require('./setNumOuts'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.xCenterOfPin, global.initialState, global.actions, global.setNumIns, global.setNumOuts);
    global.index = mod.exports;
  }
})(this, function (module, exports, _xCenterOfPin, _initialState, _actions, _setNumIns, _setNumOuts) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _xCenterOfPin2 = _interopRequireDefault(_xCenterOfPin);

  var _initialState2 = _interopRequireDefault(_initialState);

  var _setNumIns2 = _interopRequireDefault(_setNumIns);

  var _setNumOuts2 = _interopRequireDefault(_setNumOuts);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
  };

  var flowViewApp = function flowViewApp() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? _initialState2.default : arguments[0];
    var action = arguments[1];

    var nextId = 0;

    var generateId = function generateId() {
      nextId++;

      var newId = 'id' + nextId;

      var currentIds = Object.keys(state.node).concat(Object.keys(state.link));

      var foundId = currentIds.filter(function (id) {
        return id === newId;
      }).length === 1;

      if (foundId) return generateId();else return newId;
    };

    var _ret = function () {
      switch (action.type) {
        case _actions.ADD_LINK:
          var link = Object.assign({}, state.link);

          link[generateId()] = action.link;

          return {
            v: Object.assign({}, state, {
              link: link,
              selectedItems: [],
              previousDraggingPoint: action.previousDraggingPoint
            })
          };

        case _actions.ADD_NODE:
          var node = Object.assign({}, state.node);

          node[generateId()] = action.node;

          return {
            v: Object.assign({}, state, {
              node: node,
              nodeSelector: null
            })
          };

        case _actions.DELETE_LINK:
          var delLink = Object.assign({}, state);

          var linkid = action.id;

          delete delLink.link[linkid];

          return {
            v: delLink
          };

        case _actions.DEL_NODE:
          var nextState = Object.assign({}, state);

          var nodeid = action.id;

          delete nextState.node[nodeid];

          for (var _linkid in nextState.link) {
            var isSource = nextState.link[_linkid].from[0] === nodeid;
            var isTarget = nextState.link[_linkid].to[0] === nodeid;

            if (isSource || isTarget) delete nextState.link[_linkid];
          }

          return {
            v: nextState
          };

        case _actions.DRAG_ITEMS:
          var dx = action.draggingDelta.x;
          var dy = action.draggingDelta.y;

          var draggedNodes = Object.assign({}, state.node);
          var previousDraggingPoint = {
            x: state.previousDraggingPoint.x + dx,
            y: state.previousDraggingPoint.y + dy
          };

          for (var _nodeid in draggedNodes) {
            var isDraggedNode = state.selectedItems.indexOf(_nodeid) === -1;

            if (isDraggedNode) {
              continue;
            } else {
              draggedNodes[_nodeid].x += dx;
              draggedNodes[_nodeid].y += dy;
            }
          }

          return {
            v: Object.assign({}, state, {
              node: draggedNodes,
              previousDraggingPoint: previousDraggingPoint
            })
          };

        case _actions.DRAG_LINK:
          return {
            v: Object.assign({}, state, {
              previousDraggingPoint: {
                x: state.previousDraggingPoint.x + action.draggingDelta.x,
                y: state.previousDraggingPoint.y + action.draggingDelta.y
              }
            })
          };

        case _actions.END_DRAGGING_ITEMS:
          return {
            v: Object.assign({}, state, {
              isDraggingItems: false,
              previousDraggingPoint: null
            })
          };

        case _actions.END_DRAGGING_LINK:
          var newLink = Object.assign({}, state.link);
          var lastX = state.previousDraggingPoint.x;
          var lastY = state.previousDraggingPoint.y;
          var linkId = action.id;
          var draggedLink = Object.assign({}, state.link[linkId]);

          var pinRadius = state.pinRadius;
          var nodeHeight = state.nodeHeight;
          var fontWidth = state.fontWidth;

          var to = draggedLink.to;
          var from = draggedLink.from;

          Object.keys(state.node).forEach(function (nodeid) {
            // Cannot connect a node to itself.
            if (from[0] === nodeid) return;

            var node = state.node[nodeid];

            var height = node.height || nodeHeight;
            var width = node.width || (node.text.length + 4) * fontWidth;

            // Nothing to do if drag ends outside the node.
            if (lastX < node.x || lastX > node.x + width) return;
            if (lastY < node.y || lastY > node.y + height) return;

            node.ins.forEach(function (pin, i) {
              var cx = node.x + (0, _xCenterOfPin2.default)(pinRadius, width, node.ins.length, i);
              var r = 2 * pinRadius;

              if (lastX > cx - r && lastX < cx + r) to = [nodeid, i];
            });
          });

          // Connect link to target...
          if (to) newLink[linkId].to = to;
          // ...or remove dragged link if no target was found.
          else delete newLink[linkId];

          return {
            v: Object.assign({}, state, {
              previousDraggingPoint: null,
              draggedLinkId: null,
              link: newLink
            })
          };

        case _actions.HIDE_NODE_SELECTOR:
          return {
            v: Object.assign({}, state, {
              nodeSelector: null
            })
          };

        case _actions.SELECT_ITEM:
          var selectedItems = [];
          var itemId = action.id;

          var indexOfSelectedItem = selectedItems.indexOf(itemId);
          var itemIsNotAlreadySelected = indexOfSelectedItem === -1;

          if (itemIsNotAlreadySelected) {
            selectedItems.push(itemId);
          } else {
            selectedItems.splice(indexOfSelectedItem, 1);
          }

          return {
            v: Object.assign({}, state, {
              isDraggingItems: true,
              previousDraggingPoint: {
                x: action.x,
                y: action.y
              },
              selectedItems: selectedItems,
              nodeSelector: null
            })
          };

        case _actions.SET_NODE_SELECTOR_TEXT:
          return {
            v: Object.assign({}, state, {
              nodeSelector: {
                text: action.text
              }
            })
          };

        case _actions.SET_NUM_INS:
          return {
            v: (0, _setNumIns2.default)(state, action)
          };

        case _actions.SET_NUM_OUTS:
          return {
            v: (0, _setNumOuts2.default)(state, action)
          };

        case _actions.SHOW_NODE_SELECTOR:
          return {
            v: Object.assign({}, state, {
              nodeSelector: {
                x: action.x,
                y: action.y
              }
            })
          };

        default:
          return {
            v: state
          };
      }
    }();

    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
  };

  exports.default = flowViewApp;
  module.exports = exports['default'];
});