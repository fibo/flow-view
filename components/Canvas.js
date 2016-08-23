(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', 'react', '../util/initialState', './Link', './Node', './NodeSelector', '../actions'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('react'), require('../util/initialState'), require('./Link'), require('./Node'), require('./NodeSelector'), require('../actions'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.react, global.initialState, global.Link, global.Node, global.NodeSelector, global.actions);
    global.Canvas = mod.exports;
  }
})(this, function (module, exports, _react, _initialState, _Link, _Node, _NodeSelector, _actions) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  var _initialState2 = _interopRequireDefault(_initialState);

  var _Link2 = _interopRequireDefault(_Link);

  var _Node2 = _interopRequireDefault(_Node);

  var _NodeSelector2 = _interopRequireDefault(_NodeSelector);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  var Canvas = function Canvas(_ref) {
    var dispatch = _ref.dispatch;
    var nodes = _ref.nodes;
    var links = _ref.links;
    var height = _ref.height;
    var width = _ref.width;
    var pinRadius = _ref.pinRadius;
    var offset = _ref.offset;
    var draggedLinkId = _ref.draggedLinkId;
    var isDraggingLink = _ref.isDraggingLink;
    var isDraggingItems = _ref.isDraggingItems;
    var nodeSelectorX = _ref.nodeSelectorX;
    var nodeSelectorY = _ref.nodeSelectorY;
    var nodeSelectorShow = _ref.nodeSelectorShow;
    var nodeSelectorText = _ref.nodeSelectorText;
    var previousDraggingPoint = _ref.previousDraggingPoint;

    var onDragLink = function onDragLink(previousDraggingPoint) {
      return function (e) {
        e.preventDefault();
        e.stopPropagation();

        var draggingDelta = {
          x: e.clientX - offset.x - previousDraggingPoint.x,
          y: e.clientY - offset.y - previousDraggingPoint.y
        };

        dispatch((0, _actions.dragLink)(previousDraggingPoint, draggingDelta));
      };
    };

    var onEndDraggingLink = function onEndDraggingLink(draggedLinkId) {
      return function (e) {
        e.preventDefault();
        e.stopPropagation();

        dispatch((0, _actions.endDraggingLink)(draggedLinkId));
      };
    };

    var onDragItems = function onDragItems(previousDraggingPoint) {
      return function (e) {
        e.preventDefault();
        e.stopPropagation();

        var draggingDelta = {
          x: e.clientX - offset.x - previousDraggingPoint.x,
          y: e.clientY - offset.y - previousDraggingPoint.y
        };

        dispatch((0, _actions.dragItems)(previousDraggingPoint, draggingDelta));
      };
    };

    var onDeleteNode = function onDeleteNode(nodeid) {
      return function (e) {
        e.preventDefault();
        e.stopPropagation();

        dispatch((0, _actions.deleteNode)(nodeid));
      };
    };

    var onEndDraggingItems = function onEndDraggingItems(e) {
      e.preventDefault();
      e.stopPropagation();

      dispatch((0, _actions.endDraggingItems)());
    };

    var onHideNodeSelector = function onHideNodeSelector(e) {
      e.preventDefault();
      e.stopPropagation();

      dispatch((0, _actions.hideNodeSelector)());
    };

    var onShowNodeSelector = function onShowNodeSelector(e) {
      e.preventDefault();
      e.stopPropagation();

      dispatch((0, _actions.showNodeSelector)({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y
      }));
    };

    var selectLink = function selectLink(linkid) {
      return function (e) {
        e.preventDefault();
        e.stopPropagation();

        dispatch((0, _actions.selectItem)({
          id: linkid,
          x: e.clientX - offset.x,
          y: e.clientY - offset.y
        }));
      };
    };

    var selectNode = function selectNode(nodeid) {
      return function (e) {
        e.preventDefault();
        e.stopPropagation();

        dispatch((0, _actions.selectItem)({
          id: nodeid,
          x: e.clientX - offset.x,
          y: e.clientY - offset.y
        }));
      };
    };

    var onDeleteLink = function onDeleteLink(linkid) {
      return function (e) {
        e.preventDefault();
        e.stopPropagation();

        dispatch((0, _actions.deleteLink)(linkid));
      };
    };

    var onSetNumIns = function onSetNumIns(nodeid) {
      return function (e) {
        e.preventDefault();
        e.stopPropagation();

        dispatch((0, _actions.setNumIns)({
          nodeid: nodeid,
          num: e.target.value
        }));
      };
    };

    var onSetNumOuts = function onSetNumOuts(nodeid) {
      return function (e) {
        e.preventDefault();
        e.stopPropagation();

        dispatch((0, _actions.setNumOuts)({
          nodeid: nodeid,
          num: e.target.value
        }));
      };
    };

    var onAddNode = function onAddNode(_ref2) {
      var x = _ref2.x;
      var y = _ref2.y;
      var text = _ref2.text;

      console.log(x, y, text);
      dispatch((0, _actions.addNode)({ x: x, y: y, text: text }));
    };

    var onAddLink = function onAddLink(_ref3, previousDraggingPoint) {
      var from = _ref3.from;
      var to = _ref3.to;

      dispatch((0, _actions.addLink)({ from: from, to: to }, previousDraggingPoint));
    };

    return _react2.default.createElement(
      'svg',
      {
        height: height,
        width: width,
        style: { border: '1px solid black' },
        onMouseDown: onHideNodeSelector,
        onDoubleClick: onShowNodeSelector,
        onMouseMove: isDraggingLink ? onDragLink(previousDraggingPoint) : isDraggingItems ? onDragItems(previousDraggingPoint) : undefined,
        onMouseUp: isDraggingLink ? onEndDraggingLink(draggedLinkId) : isDraggingItems ? onEndDraggingItems : undefined
      },
      _react2.default.createElement(_NodeSelector2.default, {
        x: nodeSelectorX,
        y: nodeSelectorY,
        text: nodeSelectorText,
        show: nodeSelectorShow,
        addNode: onAddNode
      }),
      nodes.map(function (node, i) {
        return _react2.default.createElement(_Node2.default, _extends({
          key: i,
          pinRadius: pinRadius,
          offset: offset,
          selectNode: selectNode(node.id),
          delNode: onDeleteNode(node.id),
          addLink: onAddLink,
          endDragging: onEndDraggingItems,
          isDraggingLink: isDraggingLink,
          setNumIns: onSetNumIns(node.id),
          setNumOuts: onSetNumOuts(node.id)
        }, node));
      }),
      links.map(function (link) {
        return _react2.default.createElement(_Link2.default, _extends({
          pinRadius: pinRadius,
          selectLink: selectLink(link.id),
          deleteLink: onDeleteLink(link.id),
          key: link.id
        }, link));
      })
    );
  };

  Canvas.propTypes = {
    width: _react.PropTypes.number.isRequired,
    height: _react.PropTypes.number.isRequired,
    links: _react.PropTypes.array.isRequired,
    nodes: _react.PropTypes.array.isRequired,
    pinRadius: _react.PropTypes.number.isRequired,
    previousDraggingPoint: _react.PropTypes.shape({
      x: _react.PropTypes.number.isRequired,
      y: _react.PropTypes.number.isRequired
    })
  };

  Canvas.defaultProps = {
    pinRadius: _initialState2.default.pinRadius
  };

  exports.default = Canvas;
  module.exports = exports['default'];
});