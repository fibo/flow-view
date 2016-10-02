(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', 'react', 'react-dom', '../utils/computeNodeWidth', './Inspector', './Link', './Node', './theme', '../utils/ignoreEvent', '../utils/xOfPin', './Selector'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('react'), require('react-dom'), require('../utils/computeNodeWidth'), require('./Inspector'), require('./Link'), require('./Node'), require('./theme'), require('../utils/ignoreEvent'), require('../utils/xOfPin'), require('./Selector'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.react, global.reactDom, global.computeNodeWidth, global.Inspector, global.Link, global.Node, global.theme, global.ignoreEvent, global.xOfPin, global.Selector);
    global.Frame = mod.exports;
  }
})(this, function (module, exports, _react, _reactDom, _computeNodeWidth, _Inspector, _Link, _Node, _theme, _ignoreEvent, _xOfPin, _Selector) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  var _computeNodeWidth2 = _interopRequireDefault(_computeNodeWidth);

  var _Inspector2 = _interopRequireDefault(_Inspector);

  var _Link2 = _interopRequireDefault(_Link);

  var _Node2 = _interopRequireDefault(_Node);

  var _theme2 = _interopRequireDefault(_theme);

  var _ignoreEvent2 = _interopRequireDefault(_ignoreEvent);

  var _xOfPin2 = _interopRequireDefault(_xOfPin);

  var _Selector2 = _interopRequireDefault(_Selector);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

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

  var Frame = function (_Component) {
    _inherits(Frame, _Component);

    function Frame(props) {
      _classCallCheck(this, Frame);

      var _this = _possibleConstructorReturn(this, (Frame.__proto__ || Object.getPrototypeOf(Frame)).call(this, props));

      _this.state = {
        draggedLink: null,
        draggedItems: [],
        pointer: null,
        showSelector: false,
        selectedItems: []
      };
      return _this;
    }

    _createClass(Frame, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        var container = (0, _reactDom.findDOMNode)(this).parentNode;

        var offset = {
          x: container.offsetLeft,
          y: container.offsetTop
        };

        this.setState({ offset: offset });
      }
    }, {
      key: 'render',
      value: function render() {
        var _this2 = this;

        var _props = this.props;
        var createInputPin = _props.createInputPin;
        var createOutputPin = _props.createOutputPin;
        var createLink = _props.createLink;
        var _createNode = _props.createNode;
        var deleteLink = _props.deleteLink;
        var deleteInputPin = _props.deleteInputPin;
        var deleteNode = _props.deleteNode;
        var deleteOutputPin = _props.deleteOutputPin;
        var dragItems = _props.dragItems;
        var fontFamily = _props.fontFamily;
        var fontSize = _props.fontSize;
        var item = _props.item;
        var lineWidth = _props.lineWidth;
        var model = _props.model;
        var nodeBodyHeight = _props.nodeBodyHeight;
        var pinSize = _props.pinSize;
        var style = _props.style;
        var typeOfNode = _props.typeOfNode;
        var updateLink = _props.updateLink;
        var view = _props.view;
        var _state = this.state;
        var draggedItems = _state.draggedItems;
        var draggedLink = _state.draggedLink;
        var offset = _state.offset;
        var pointer = _state.pointer;
        var selectedItems = _state.selectedItems;
        var showSelector = _state.showSelector;


        var height = view.height;
        var width = view.width;

        var Inspector = item.inspector.DefaultInspector;
        var Link = item.link.DefaultLink;

        var setState = this.setState.bind(this);

        var getCoordinates = function getCoordinates(e) {
          return {
            x: e.clientX - offset.x,
            y: e.clientY - offset.y
          };
        };

        var onClick = function onClick(e) {
          e.preventDefault();
          e.stopPropagation();

          setState({
            showSelector: false
          });
        };

        var onCreateLink = function onCreateLink(link) {
          var id = createLink(link);

          link.id = id;

          setState({
            draggedLink: link
          });
        };

        var onUpdateLink = function onUpdateLink(id, link) {
          updateLink(id, link);

          var disconnectingLink = link.to === null;

          if (disconnectingLink) {
            link.id = id;

            setState({
              draggedLink: link
            });
          } else {
            setState({
              draggedLink: null
            });
          }
        };

        var onDoubleClick = function onDoubleClick(e) {
          e.preventDefault();
          e.stopPropagation();

          setState({
            pointer: getCoordinates(e),
            showSelector: true
          });
        };

        var onMouseDown = function onMouseDown(e) {
          e.preventDefault();
          e.stopPropagation();

          // TODO Shift key for multiple selection.

          setState({
            selectedItems: []
          });
        };

        var onMouseLeave = function onMouseLeave(e) {
          e.preventDefault();
          e.stopPropagation();

          var draggedLink = _this2.state.draggedLink;
          if (draggedLink) deleteLink(draggedLink.id);

          setState({
            draggedItems: [],
            draggedLink: null,
            pointer: null,
            showSelector: false
          });
        };

        var onMouseMove = function onMouseMove(e) {
          e.preventDefault();
          e.stopPropagation();

          var nextPointer = getCoordinates(e);

          setState({
            pointer: nextPointer
          });

          var draggedItems = _this2.state.draggedItems;

          if (draggedItems.length > 0) {
            var draggingDelta = {
              x: pointer ? nextPointer.x - pointer.x : 0,
              y: pointer ? nextPointer.y - pointer.y : 0
            };

            dragItems(draggingDelta, draggedItems);
          }
        };

        var onMouseUp = function onMouseUp(e) {
          e.preventDefault();
          e.stopPropagation();

          var draggedLink = _this2.state.draggedLink;

          if (draggedLink) {
            deleteLink(draggedLink.id);

            setState({
              draggedLink: null,
              pointer: null
            });
          } else {
            setState({
              draggedItems: [],
              selectedItems: [],
              pointer: null
            });
          }
        };

        /**
         * Bring up selected nodes.
         */

        var selectedFirst = function selectedFirst(a, b) {
          // FIXME it works, but it would be nice if the selected
          // items keep being up after deselection.
          var aIsSelected = selectedItems.indexOf(a) > -1;
          var bIsSelected = selectedItems.indexOf(b) > -1;

          if (aIsSelected && bIsSelected) return 0;

          if (aIsSelected) return 1;
          if (bIsSelected) return -1;
        };

        var selectItem = function selectItem(id) {
          return function (e) {
            e.preventDefault();
            e.stopPropagation();

            // Do not select items when releasing a dragging link.

            var draggedLink = _this2.state.draggedLink;

            if (draggedLink) {
              deleteLink(draggedLink.id);

              setState({
                draggedLink: null
              });

              return;
            }

            var selectedItems = Object.assign([], _this2.state.selectedItems);

            var index = selectedItems.indexOf(id);

            if (index === -1) {
              // Shift key allows multiple selection.
              if (e.shiftKey) {
                // TODO it does not work.
                selectedItems.push(id);
              } else {
                selectedItems = [id];
              }
            } else {
              selectedItems.splice(index, 1);
            }

            setState({
              draggedItems: [],
              selectedItems: selectedItems
            });
          };
        };

        var willDragItem = function willDragItem(id) {
          return function (e) {
            e.preventDefault();
            e.stopPropagation();

            var draggedItems = Object.assign([], _this2.state.draggedItems);

            var index = draggedItems.indexOf(id);

            if (index === -1) {
              // Shift key allows multiple selection.
              if (e.shiftKey) {
                // TODO it does not work.
                draggedItems.push(id);
              } else {
                draggedItems = [id];
              }
            }

            setState({
              draggedItems: draggedItems,
              selectedItems: []
            });
          };
        };

        return _react2.default.createElement(
          'svg',
          {
            fontFamily: fontFamily,
            fontSize: fontSize,
            height: height,
            onClick: onClick,
            onDoubleClick: onDoubleClick,
            onMouseDown: onMouseDown,
            onMouseEnter: _ignoreEvent2.default,
            onMouseLeave: onMouseLeave,
            onMouseMove: onMouseMove,
            onMouseUp: onMouseUp,
            textAnchor: 'start',
            style: style,
            width: width
          },
          Object.keys(view.node).sort(selectedFirst).map(function (id, i) {
            var node = view.node[id];

            var height = node.height;
            var ins = node.ins;
            var outs = node.outs;
            var text = node.text;
            var width = node.width;
            var x = node.x;
            var y = node.y;


            var nodeType = typeOfNode(node);
            var Node = item.node[nodeType];

            return _react2.default.createElement(Node, {
              key: i,
              dragged: draggedItems.indexOf(id) > -1,
              draggedLink: draggedLink,
              fontSize: fontSize,
              height: height,
              id: id,
              ins: ins,
              model: model,
              onCreateLink: onCreateLink,
              outs: outs,
              pinSize: pinSize,
              selected: selectedItems.indexOf(id) > -1,
              selectNode: selectItem(id),
              text: text,
              updateLink: onUpdateLink,
              width: width,
              willDragNode: willDragItem(id),
              x: x,
              y: y
            });
          }),
          Object.keys(view.link).map(function (id, i) {
            var _view$link$id = view.link[id];
            var from = _view$link$id.from;
            var to = _view$link$id.to;


            var x1 = null;
            var y1 = null;
            var x2 = null;
            var y2 = null;

            var nodeIds = Object.keys(view.node);
            var idEquals = function idEquals(x) {
              return function (id) {
                return id === x[0];
              };
            };
            var sourceId = from ? nodeIds.find(idEquals(from)) : null;
            var targetId = to ? nodeIds.find(idEquals(to)) : null;

            var computedWidth = null;

            if (sourceId) {
              var source = view.node[sourceId];

              computedWidth = (0, _computeNodeWidth2.default)({
                bodyHeight: nodeBodyHeight, // TODO custom nodes height
                pinSize: pinSize,
                fontSize: fontSize,
                node: source
              });

              x1 = source.x + (0, _xOfPin2.default)(pinSize, computedWidth, source.outs.length, from[1]);
              y1 = source.y + pinSize + nodeBodyHeight;
            }

            if (targetId) {
              var target = view.node[targetId];

              computedWidth = (0, _computeNodeWidth2.default)({
                bodyHeight: nodeBodyHeight, // TODO custom nodes height
                pinSize: pinSize,
                fontSize: fontSize,
                node: target
              });

              x2 = target.x + (0, _xOfPin2.default)(pinSize, computedWidth, target.ins.length, to[1]);
              y2 = target.y;
            } else {
              // FIXME at first, pointer is null. This trick works, but,
              // it should be reviosioned when implementing creating links
              // in the opposite direction.
              x2 = pointer ? pointer.x - pinSize / 2 : x1;
              y2 = pointer ? pointer.y - pinSize : y1;
            }

            return _react2.default.createElement(Link, {
              key: i,
              from: from,
              lineWidth: lineWidth,
              id: id,
              onCreateLink: onCreateLink,
              onUpdateLink: onUpdateLink,
              pinSize: pinSize,
              selected: selectedItems.indexOf(id) > -1,
              selectLink: selectItem(id),
              to: to,
              x1: x1,
              y1: y1,
              x2: x2,
              y2: y2
            });
          }),
          _react2.default.createElement(Inspector, {
            createInputPin: createInputPin,
            createOutputPin: createOutputPin,
            deleteLink: deleteLink,
            deleteNode: deleteNode,
            deleteInputPin: deleteInputPin,
            deleteOutputPin: deleteOutputPin,
            items: Object.assign([], selectedItems, draggedItems),
            view: view
          }),
          _react2.default.createElement(_Selector2.default, {
            createNode: function createNode(node) {
              _createNode(node);

              // Need to change state to force React rendering.
              setState({
                showSelector: false
              });
            },
            pointer: pointer,
            show: showSelector
          })
        );
      }
    }]);

    return Frame;
  }(_react.Component);

  Frame.propTypes = {
    createInputPin: _react.PropTypes.func.isRequired,
    createOutputPin: _react.PropTypes.func.isRequired,
    createLink: _react.PropTypes.func.isRequired,
    createNode: _react.PropTypes.func.isRequired,
    deleteLink: _react.PropTypes.func.isRequired,
    deleteNode: _react.PropTypes.func.isRequired,
    dragItems: _react.PropTypes.func.isRequired,
    fontFamily: _react.PropTypes.string.isRequired,
    fontSize: _react.PropTypes.number.isRequired,
    item: _react.PropTypes.shape({
      inspector: _react.PropTypes.object.isRequired,
      link: _react.PropTypes.object.isRequired,
      node: _react.PropTypes.object.isRequired
    }).isRequired,
    nodeBodyHeight: _react.PropTypes.number.isRequired,
    lineWidth: _react.PropTypes.number.isRequired,
    deleteInputPin: _react.PropTypes.func.isRequired,
    deleteOutputPin: _react.PropTypes.func.isRequired,
    pinSize: _react.PropTypes.number.isRequired,
    style: _react.PropTypes.object.isRequired,
    typeOfNode: _react.PropTypes.func.isRequired,
    updateLink: _react.PropTypes.func.isRequired,
    view: _react.PropTypes.shape({
      height: _react.PropTypes.number.isRequired,
      link: _react.PropTypes.object.isRequired,
      node: _react.PropTypes.object.isRequired,
      width: _react.PropTypes.number.isRequired
    }).isRequired
  };

  Frame.defaultProps = {
    createInputPin: Function.prototype,
    createOutputPin: Function.prototype,
    createLink: Function.prototype,
    createNode: Function.prototype,
    deleteLink: Function.prototype,
    deleteInputPin: Function.prototype,
    deleteNode: Function.prototype,
    deleteOutputPin: Function.prototype,
    dragItems: Function.prototype,
    fontFamily: _theme2.default.fontFamily,
    fontSize: 17, // FIXME fontSize seems to be ignored
    item: {
      inspector: { DefaultInspector: _Inspector2.default },
      link: { DefaultLink: _Link2.default },
      node: { DefaultNode: _Node2.default }
    },
    lineWidth: _theme2.default.lineWidth,
    nodeBodyHeight: _theme2.default.nodeBodyHeight,
    pinSize: _theme2.default.pinSize,
    style: { border: '1px solid black' },
    typeOfNode: function typeOfNode(node) {
      return 'DefaultNode';
    },
    updateLink: Function.prototype,
    view: {
      height: 400,
      link: {},
      node: {},
      width: 400
    }
  };

  exports.default = Frame;
  module.exports = exports['default'];
});