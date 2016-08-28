(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'react-redux', '../util/xCenterOfPin', '../components/Canvas'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('react-redux'), require('../util/xCenterOfPin'), require('../components/Canvas'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.reactRedux, global.xCenterOfPin, global.Canvas);
    global.FlowView = mod.exports;
  }
})(this, function (exports, _reactRedux, _xCenterOfPin, _Canvas) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.mapStateToProps = mapStateToProps;

  var _xCenterOfPin2 = _interopRequireDefault(_xCenterOfPin);

  var _Canvas2 = _interopRequireDefault(_Canvas);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function mapStateToProps(state, ownProps) {
    var documentElement = ownProps.documentElement;

    var offset = {
      x: documentElement.offsetLeft,
      y: documentElement.offsetTop
    };

    var nodes = [];

    var draggedLinkId = state.view.draggedLinkId;

    var pinRadius = state.view.pinRadius;
    var nodeHeight = state.view.nodeHeight;
    var fontWidth = state.view.fontWidth;

    var previousDraggingPoint = state.view.previousDraggingPoint;

    var _loop = function _loop(id) {
      var node = Object.assign({}, { ins: [], outs: [] }, state.view.node[id]);

      // TODO these two lines are repeated in reducers/index.js, refactor them!
      var height = node.height || nodeHeight;
      var width = node.width || (node.text.length + 4) * fontWidth;

      var ins = node.ins.map(function (pin, i, pins) {
        return {
          cx: (0, _xCenterOfPin2.default)(pinRadius, width, pins.length, i),
          cy: pinRadius,
          r: pinRadius,
          data: pins[i]
        };
      });

      var outs = node.outs.map(function (pin, i, pins) {
        return {
          cx: (0, _xCenterOfPin2.default)(pinRadius, width, pins.length, i),
          cy: height - pinRadius,
          r: pinRadius,
          data: pins[i]
        };
      });

      nodes.push({
        height: height,
        id: id,
        ins: ins,
        outs: outs,
        selected: state.view.selectedItems.indexOf(id) > -1,
        text: node.text,
        width: width,
        y: node.y,
        x: node.x
      });
    };

    for (var id in state.view.node) {
      _loop(id);
    }

    var links = [];

    for (var _id in state.view.link) {
      var link = Object.assign({}, state.view.link[_id]);

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
        dragged: draggedLinkId === _id,
        id: _id,
        selected: state.view.selectedItems.indexOf(_id) > -1,
        x: x,
        y: y,
        x2: x2,
        y2: y2
      });
    }

    var nodeSelectorShow = state.view.nodeSelector !== null;
    var nodeSelectorX = 0;
    var nodeSelectorY = 0;

    if (nodeSelectorShow) {
      nodeSelectorX = state.view.nodeSelector.x;
      nodeSelectorY = state.view.nodeSelector.y;
    }

    var isDraggingLink = draggedLinkId !== null;

    return {
      height: ownProps.height || state.view.height,
      width: ownProps.width || state.view.width,
      nodes: nodes,
      links: links,
      offset: offset,
      pinRadius: pinRadius,
      selectedItems: state.view.selectedItems,
      previousDraggingPoint: previousDraggingPoint,
      isDraggingLink: isDraggingLink,
      isDraggingItems: state.view.isDraggingItems,
      nodeSelectorX: nodeSelectorX,
      nodeSelectorY: nodeSelectorY,
      nodeSelectorShow: nodeSelectorShow,
      draggedLinkId: draggedLinkId
    };
  }

  exports.default = (0, _reactRedux.connect)(mapStateToProps)(_Canvas2.default);
});