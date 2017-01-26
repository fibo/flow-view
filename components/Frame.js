(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', 'react', 'react-dom', '../utils/computeNodeWidth', './Link', './Node', './theme', '../utils/ignoreEvent', '../utils/xOfPin', './Selector'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('react'), require('react-dom'), require('../utils/computeNodeWidth'), require('./Link'), require('./Node'), require('./theme'), require('../utils/ignoreEvent'), require('../utils/xOfPin'), require('./Selector'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.react, global.reactDom, global.computeNodeWidth, global.Link, global.Node, global.theme, global.ignoreEvent, global.xOfPin, global.Selector);
    global.Frame = mod.exports;
  }
})(this, function (module, exports, _react, _reactDom, _computeNodeWidth, _Link, _Node, _theme, _ignoreEvent, _xOfPin, _Selector) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  var _computeNodeWidth2 = _interopRequireDefault(_computeNodeWidth);

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

  var getTime = function getTime() {
    return new Date() / 1;
  };

  var Frame = function (_Component) {
    _inherits(Frame, _Component);

    function Frame(props) {
      _classCallCheck(this, Frame);

      var _this = _possibleConstructorReturn(this, (Frame.__proto__ || Object.getPrototypeOf(Frame)).call(this, props));

      _this.state = {
        dynamicView: { height: null, width: null },
        draggedLinkId: null,
        draggedItems: [],
        offset: { x: 0, y: 0 },
        pointer: null,
        scroll: { x: 0, y: 0 },
        showSelector: false,
        selectedItems: [],
        selectionBoundingBox: null,
        whenUpdated: getTime() // this attribute is used to force React render.
      };
      return _this;
    }

    _createClass(Frame, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        var setState = this.setState.bind(this);

        var container = (0, _reactDom.findDOMNode)(this).parentNode;

        window.addEventListener('scroll', function () {
          setState({ scroll: {
              x: window.scrollX,
              y: window.scrollY
            } });
        });

        window.addEventListener('resize', function () {
          var rect = container.getBoundingClientRect();

          setState({ dynamicView: {
              height: rect.height,
              width: rect.width
            } });
        });

        var offset = {
          x: container.offsetLeft,
          y: container.offsetTop
        };

        var scroll = {
          x: window.scrollX,
          y: window.scrollY
        };

        setState({ offset: offset, scroll: scroll });
      }
    }, {
      key: 'render',
      value: function render() {
        var _this2 = this;

        var _props = this.props,
            createInputPin = _props.createInputPin,
            createLink = _props.createLink,
            _createNode = _props.createNode,
            createOutputPin = _props.createOutputPin,
            deleteInputPin = _props.deleteInputPin,
            deleteLink = _props.deleteLink,
            deleteNode = _props.deleteNode,
            deleteOutputPin = _props.deleteOutputPin,
            dragItems = _props.dragItems,
            fontSize = _props.fontSize,
            item = _props.item,
            model = _props.model,
            theme = _props.theme,
            updateLink = _props.updateLink,
            view = _props.view;
        var _state = this.state,
            draggedItems = _state.draggedItems,
            draggedLinkId = _state.draggedLinkId,
            pointer = _state.pointer,
            dynamicView = _state.dynamicView,
            selectedItems = _state.selectedItems,
            showSelector = _state.showSelector;
        var frameBorder = theme.frameBorder,
            fontFamily = theme.fontFamily,
            lineWidth = theme.lineWidth,
            nodeBodyHeight = theme.nodeBodyHeight,
            pinSize = theme.pinSize;


        var height = dynamicView.height || view.height;
        var width = dynamicView.width || view.width;

        var typeOfNode = item.util.typeOfNode;

        var Link = item.link.DefaultLink;

        var setState = this.setState.bind(this);

        var coordinatesOfLink = function coordinatesOfLink(_ref) {
          var from = _ref.from,
              to = _ref.to;

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
              bodyHeight: nodeBodyHeight,
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
              bodyHeight: nodeBodyHeight,
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

          return { x1: x1, y1: y1, x2: x2, y2: y2 };
        };

        var getCoordinates = function getCoordinates(e) {
          var _state2 = _this2.state,
              offset = _state2.offset,
              scroll = _state2.scroll;


          return {
            x: e.clientX - offset.x + scroll.x,
            y: e.clientY - offset.y + scroll.y
          };
        };

        var onClick = function onClick(e) {
          e.preventDefault();
          e.stopPropagation();

          setState({ showSelector: false });
        };

        var onCreateLink = function onCreateLink(link) {
          var draggedLinkId = createLink(link);

          setState({ draggedLinkId: draggedLinkId });
        };

        var onUpdateLink = function onUpdateLink(id, link) {
          updateLink(id, link);

          var disconnectingLink = link.to === null;

          if (disconnectingLink) {
            link.id = id;

            setState({ draggedLinkId: id });
          } else {
            setState({ draggedLinkId: null });
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

          var draggedLinkId = _this2.state.draggedLinkId;
          if (draggedLinkId) delete view.link[draggedLinkId];

          setState({
            draggedItems: [],
            draggedLinkId: null,
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

          var draggedLinkId = _this2.state.draggedLinkId;

          if (draggedLinkId) {
            delete view.link[draggedLinkId];

            setState({
              draggedLinkId: null,
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

            var boundingBox = null;

            // Do not select items when releasing a dragging link.

            var draggedLinkId = _this2.state.draggedLinkId;

            if (draggedLinkId) {
              delete view.link[draggedLinkId];

              setState({
                draggedLinkId: null
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

            selectedItems.forEach(function (id) {
              var link = view.link[id];
              var node = view.node[id];

              if (node) {
                var computedWidth = (0, _computeNodeWidth2.default)({
                  bodyHeight: nodeBodyHeight,
                  pinSize: pinSize,
                  fontSize: fontSize,
                  node: node
                });

                boundingBox = {
                  x1: node.x,
                  y1: node.y,
                  x2: computedWidth + node.x,
                  y2: nodeBodyHeight + node.y
                };
              }

              if (link) {
                boundingBox = coordinatesOfLink(link);
              }
            });

            setState({
              draggedItems: [],
              selectedItems: selectedItems,
              selectionBoundingBox: boundingBox
            });
          };
        };

        var startDraggingLinkTarget = function startDraggingLinkTarget(id) {
          // Remember link source.
          var from = view.link[id].from;

          // Delete dragged link so the 'deleteLink' event is triggered.
          deleteLink(id);

          // Create a brand new link, this is the right choice to avoid
          // conflicts, for example the user could start dragging the link
          // target and then drop it again in the same target.
          var draggedLinkId = createLink({ from: from });
          setState({ draggedLinkId: draggedLinkId });
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
            style: { border: frameBorder },
            width: width
          },
          Object.keys(view.node).sort(selectedFirst).map(function (id, i) {
            var node = view.node[id];

            var height = node.height,
                ins = node.ins,
                outs = node.outs,
                text = node.text,
                width = node.width,
                x = node.x,
                y = node.y;


            var nodeType = typeOfNode(node);
            var Node = item.node[nodeType];

            return _react2.default.createElement(Node, { key: i,
              createInputPin: createInputPin,
              createOutputPin: createOutputPin,
              dragged: draggedItems.indexOf(id) > -1,
              draggedLinkId: draggedLinkId,
              deleteInputPin: deleteInputPin,
              deleteNode: deleteNode,
              deleteOutputPin: deleteOutputPin,
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
            var _view$link$id = view.link[id],
                from = _view$link$id.from,
                to = _view$link$id.to;


            var coord = coordinatesOfLink(view.link[id]);

            return _react2.default.createElement(Link, {
              key: i,
              from: from,
              lineWidth: lineWidth,
              id: id,
              onCreateLink: onCreateLink,
              startDraggingLinkTarget: startDraggingLinkTarget,
              pinSize: pinSize,
              selected: selectedItems.indexOf(id) > -1,
              selectLink: selectItem(id),
              to: to,
              x1: coord.x1,
              y1: coord.y1,
              x2: coord.x2,
              y2: coord.y2
            });
          }),
          _react2.default.createElement(_Selector2.default, {
            createNode: function createNode(node) {
              var id = _createNode(node);

              setState({
                selectedItems: [id],
                showSelector: false,
                whenUpdated: getTime()
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
    deleteInputPin: _react.PropTypes.func.isRequired,
    deleteNode: _react.PropTypes.func.isRequired,
    deleteOutputPin: _react.PropTypes.func.isRequired,
    dragItems: _react.PropTypes.func.isRequired,
    fontSize: _react.PropTypes.number.isRequired,
    item: _react.PropTypes.shape({
      link: _react.PropTypes.object.isRequired,
      node: _react.PropTypes.object.isRequired,
      util: _react.PropTypes.shape({
        typeOfNode: _react.PropTypes.func.isRequired
      })
    }).isRequired,
    theme: _theme2.default.propTypes,
    updateLink: _react.PropTypes.func.isRequired,
    view: _react.PropTypes.shape({
      height: _react.PropTypes.number.isRequired,
      link: _react.PropTypes.object.isRequired,
      node: _react.PropTypes.object.isRequired,
      width: _react.PropTypes.number.isRequired
    }).isRequired
  };

  Frame.defaultProps = {
    createLink: Function.prototype,
    createNode: Function.prototype,
    createInputPin: Function.prototype,
    createOutputPin: Function.prototype,
    deleteInputPin: Function.prototype,
    deleteLink: Function.prototype,
    deleteNode: Function.prototype,
    deleteOutputPin: Function.prototype,
    dragItems: Function.prototype,
    fontSize: 17, // FIXME fontSize seems to be ignored
    item: {
      link: { DefaultLink: _Link2.default },
      node: { DefaultNode: _Node2.default },
      util: {
        typeOfNode: function typeOfNode(node) {
          return 'DefaultNode';
        }
      }
    },
    theme: _theme2.default.defaultProps,
    updateLink: Function.prototype,
    view: {
      link: {},
      node: {}
    }
  };

  exports.default = Frame;
  module.exports = exports['default'];
});