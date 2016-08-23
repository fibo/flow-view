(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'react-redux', '../util/xCenterOfPin', '../actions', '../components/Canvas'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('react-redux'), require('../util/xCenterOfPin'), require('../actions'), require('../components/Canvas'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.reactRedux, global.xCenterOfPin, global.actions, global.Canvas);
    global.App = mod.exports;
  }
})(this, function (exports, _reactRedux, _xCenterOfPin, _actions, _Canvas) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.mapStateToProps = mapStateToProps;
  exports.mapDispatchToProps = mapDispatchToProps;

  var _xCenterOfPin2 = _interopRequireDefault(_xCenterOfPin);

  var _Canvas2 = _interopRequireDefault(_Canvas);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  // TODO refactor state and props to reogranize it and simplify it.
  // In particular it would be easier for external libs importing flow-view
  // if mapDispatchToProps is omitted, so it is necessary to refactor everything
  // and use dispatch in every component.
  // This has also a huge benefit! That custom components (from external libs)
  // can use dispatch directly and do not need a custom mapDispatchToProps.
  function mapStateToProps(state, ownProps) {
    var container = ownProps.container;

    var offset = {
      x: container.offsetLeft,
      y: container.offsetTop
    };

    var nodes = [];

    var draggedLinkId = state.draggedLinkId;

    var pinRadius = state.pinRadius;
    var nodeHeight = state.nodeHeight;
    var fontWidth = state.fontWidth;

    var previousDraggingPoint = state.previousDraggingPoint;

    var _loop = function _loop(id) {
      var node = Object.assign({}, { ins: [], outs: [] }, state.node[id]);

      // TODO these two lines are repeated in reducers/index.js, refactor them!
      var height = node.height || nodeHeight;
      var width = node.width || (node.text.length + 4) * fontWidth;

      var ins = node.ins.map(function (pin, i, ins) {
        return {
          cx: (0, _xCenterOfPin2.default)(pinRadius, width, ins.length, i),
          cy: pinRadius,
          r: pinRadius,
          data: ins[i]
        };
      });

      var outs = node.outs.map(function (pin, i, outs) {
        return {
          cx: (0, _xCenterOfPin2.default)(pinRadius, width, outs.length, i),
          cy: height - pinRadius,
          r: pinRadius,
          data: outs[i]
        };
      });

      nodes.push({
        id: id,
        x: node.x,
        y: node.y,
        text: node.text,
        width: width, height: height,
        ins: ins,
        outs: outs,
        selected: state.selectedItems.indexOf(id) > -1
      });
    };

    for (var id in state.node) {
      _loop(id);
    }

    var links = [];

    for (var _id in state.link) {
      var link = Object.assign({}, state.link[_id]);

      var x = null;
      var y = null;
      var x2 = null;
      var y2 = null;

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = nodes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var node = _step.value;

          // Source node.
          if (Array.isArray(link.from) && node.id === link.from[0]) {
            var position = link.from[1] || 0;
            x = node.x + (0, _xCenterOfPin2.default)(pinRadius, node.width, node.outs.length, position);
            y = node.y + node.height - pinRadius;
          }

          // Target node.
          if (Array.isArray(link.to) && node.id === link.to[0]) {
            var _position = link.to[1] || 0;
            x2 = node.x + (0, _xCenterOfPin2.default)(pinRadius, node.width, node.ins.length, _position);
            y2 = node.y + pinRadius;
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      if (link.from === null) {
        draggedLinkId = _id;
        x = previousDraggingPoint.x;
        y = previousDraggingPoint.y;
      }

      if (link.to === null) {
        draggedLinkId = _id;
        x2 = previousDraggingPoint.x;
        y2 = previousDraggingPoint.y;
      }

      links.push({
        id: _id,
        selected: state.selectedItems.indexOf(_id) > -1,
        dragged: draggedLinkId === _id,
        x: x, y: y,
        x2: x2, y2: y2
      });
    }

    var nodeSelectorShow = state.nodeSelector !== null;
    var nodeSelectorX = 0;
    var nodeSelectorY = 0;
    var nodeSelectorText = '';

    if (nodeSelectorShow) {
      nodeSelectorX = state.nodeSelector.x;
      nodeSelectorY = state.nodeSelector.y;
      nodeSelectorText = state.nodeSelector.text;
    }

    var isDraggingLink = draggedLinkId !== null;

    return {
      height: ownProps.height || state.height,
      width: ownProps.width || state.width,
      nodes: nodes,
      links: links,
      offset: offset,
      pinRadius: pinRadius,
      selectedItems: state.selectedItems,
      previousDraggingPoint: previousDraggingPoint,
      isDraggingLink: isDraggingLink,
      isDraggingItems: state.isDraggingItems,
      nodeSelectorX: nodeSelectorX,
      nodeSelectorY: nodeSelectorY,
      nodeSelectorShow: nodeSelectorShow,
      nodeSelectorText: nodeSelectorText,
      draggedLinkId: draggedLinkId
    };
  }

  function mapDispatchToProps(dispatch, ownProps) {
    var container = ownProps.container;

    var offset = {
      x: container.offsetLeft,
      y: container.offsetTop
    };

    return {
      dispatch: dispatch,
      deleteLink: function deleteLink(linkid) {
        return function (e) {
          e.preventDefault();
          e.stopPropagation();

          dispatch((0, _actions.deleteLink)(linkid));
        };
      },
      delNode: function delNode(nodeid) {
        return function (e) {
          e.preventDefault();
          e.stopPropagation();

          dispatch((0, _actions.delNode)(nodeid));
        };
      },
      dragItems: function dragItems(previousDraggingPoint) {
        return function (e) {
          e.preventDefault();
          e.stopPropagation();

          var draggingDelta = {
            x: e.clientX - offset.x - previousDraggingPoint.x,
            y: e.clientY - offset.y - previousDraggingPoint.y
          };

          dispatch((0, _actions.dragItems)(previousDraggingPoint, draggingDelta));
        };
      },
      endDraggingLink: function endDraggingLink(draggedLinkId) {
        return function (e) {
          e.preventDefault();
          e.stopPropagation();

          dispatch((0, _actions.endDraggingLink)(draggedLinkId));
        };
      },
      endDraggingItems: function endDraggingItems(e) {
        e.preventDefault();
        e.stopPropagation();

        dispatch((0, _actions.endDraggingItems)());
      },
      hideNodeSelector: function hideNodeSelector(e) {
        e.preventDefault();
        e.stopPropagation();

        dispatch((0, _actions.hideNodeSelector)());
      },
      selectLink: function selectLink(linkid) {
        return function (e) {
          e.preventDefault();
          e.stopPropagation();

          dispatch((0, _actions.selectItem)({
            id: linkid,
            x: e.clientX - offset.x,
            y: e.clientY - offset.y
          }));
        };
      },
      selectNode: function selectNode(nodeid) {
        return function (e) {
          e.preventDefault();
          e.stopPropagation();

          dispatch((0, _actions.selectItem)({
            id: nodeid,
            x: e.clientX - offset.x,
            y: e.clientY - offset.y
          }));
        };
      },
      setNodeSelectorText: function setNodeSelectorText(e) {
        e.preventDefault();
        e.stopPropagation();

        (0, _actions.setNodeSelectorText)({
          text: e.target.value
        });
      },
      setNumIns: function setNumIns(nodeid) {
        return function (e) {
          e.preventDefault();
          e.stopPropagation();

          dispatch((0, _actions.setNumIns)({
            nodeid: nodeid,
            num: e.target.value
          }));
        };
      },
      setNumOuts: function setNumOuts(nodeid) {
        return function (e) {
          e.preventDefault();
          e.stopPropagation();

          dispatch((0, _actions.setNumOuts)({
            nodeid: nodeid,
            num: e.target.value
          }));
        };
      },
      showNodeSelector: function showNodeSelector(e) {
        e.preventDefault();
        e.stopPropagation();

        dispatch((0, _actions.showNodeSelector)({
          x: e.clientX - offset.x,
          y: e.clientY - offset.y
        }));
      }
    };
  }

  exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(_Canvas2.default);
});