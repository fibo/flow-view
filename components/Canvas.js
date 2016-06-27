(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', 'react', '../util/initialState', './Link', './Node', './NodeSelector'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('react'), require('../util/initialState'), require('./Link'), require('./Node'), require('./NodeSelector'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.react, global.initialState, global.Link, global.Node, global.NodeSelector);
    global.Canvas = mod.exports;
  }
})(this, function (module, exports, _react, _initialState, _Link, _Node, _NodeSelector) {
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
    var hideNodeSelector = _ref.hideNodeSelector;
    var pinRadius = _ref.pinRadius;
    var addNode = _ref.addNode;
    var delNode = _ref.delNode;
    var deleteLink = _ref.deleteLink;
    var selectLink = _ref.selectLink;
    var selectNode = _ref.selectNode;
    var addLink = _ref.addLink;
    var draggedLinkId = _ref.draggedLinkId;
    var isDraggingLink = _ref.isDraggingLink;
    var isDraggingItems = _ref.isDraggingItems;
    var dragItems = _ref.dragItems;
    var dragLink = _ref.dragLink;
    var endDraggingItems = _ref.endDraggingItems;
    var endDraggingLink = _ref.endDraggingLink;
    var showNodeSelector = _ref.showNodeSelector;
    var nodeSelectorX = _ref.nodeSelectorX;
    var nodeSelectorY = _ref.nodeSelectorY;
    var nodeSelectorShow = _ref.nodeSelectorShow;
    var nodeSelectorText = _ref.nodeSelectorText;
    var setNodeSelectorText = _ref.setNodeSelectorText;
    var setNumIns = _ref.setNumIns;
    var setNumOuts = _ref.setNumOuts;
    var previousDraggingPoint = _ref.previousDraggingPoint;
    return _react2.default.createElement(
      'svg',
      {
        height: height,
        width: width,
        style: { border: '1px solid black' },
        onMouseDown: hideNodeSelector,
        onDoubleClick: showNodeSelector,
        onMouseMove: isDraggingLink ? dragLink(previousDraggingPoint) : isDraggingItems ? dragItems(previousDraggingPoint) : undefined,
        onMouseUp: isDraggingLink ? endDraggingLink(draggedLinkId) : isDraggingItems ? endDraggingItems : undefined
      },
      _react2.default.createElement(_NodeSelector2.default, {
        x: nodeSelectorX,
        y: nodeSelectorY,
        text: nodeSelectorText,
        show: nodeSelectorShow,
        changeText: setNodeSelectorText,
        addNode: addNode,
        dispatch: dispatch
      }),
      nodes.map(function (node, i) {
        return _react2.default.createElement(_Node2.default, _extends({
          key: i,
          pinRadius: pinRadius,
          addLink: addLink,
          selectNode: selectNode(node.id),
          delNode: delNode(node.id),
          endDragging: endDraggingItems,
          isDraggingLink: isDraggingLink,
          setNumIns: setNumIns(node.id),
          setNumOuts: setNumOuts(node.id)
        }, node));
      }),
      links.map(function (link) {
        return _react2.default.createElement(_Link2.default, _extends({
          pinRadius: pinRadius,
          selectLink: selectLink(link.id),
          deleteLink: deleteLink(link.id),
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