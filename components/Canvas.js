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

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  var Canvas = function (_Component) {
    _inherits(Canvas, _Component);

    function Canvas() {
      _classCallCheck(this, Canvas);

      return _possibleConstructorReturn(this, (Canvas.__proto__ || Object.getPrototypeOf(Canvas)).apply(this, arguments));
    }

    _createClass(Canvas, [{
      key: 'render',
      value: function render() {
        var _props = this.props;
        var dispatch = _props.dispatch;
        var nodes = _props.nodes;
        var links = _props.links;
        var height = _props.height;
        var width = _props.width;
        var pinRadius = _props.pinRadius;
        var offset = _props.offset;
        var draggedLinkId = _props.draggedLinkId;
        var isDraggingLink = _props.isDraggingLink;
        var isDraggingItems = _props.isDraggingItems;
        var nodeSelectorX = _props.nodeSelectorX;
        var nodeSelectorY = _props.nodeSelectorY;
        var nodeSelectorShow = _props.nodeSelectorShow;
        var nodeSelectorText = _props.nodeSelectorText;
        var previousDraggingPoint = _props.previousDraggingPoint;


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

        var onAddNode = function onAddNode(_ref) {
          var x = _ref.x;
          var y = _ref.y;
          var text = _ref.text;

          dispatch((0, _actions.addNode)({ x: x, y: y, text: text }));
        };

        var onAddLink = function onAddLink(_ref2, previousDraggingPoint) {
          var from = _ref2.from;
          var to = _ref2.to;

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
      }
    }]);

    return Canvas;
  }(_react.Component);

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

  // TODO emptyView.pinRadius should be in defaultTheme
  Canvas.defaultProps = {
    pinRadius: emptyView.pinRadius
  };

  exports.default = Canvas;
  module.exports = exports['default'];
});