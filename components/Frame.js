(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', 'react', 'react-dom', 'not-defined', '../utils/computeNodeWidth', './Link', './Node', './theme', '../utils/ignoreEvent', '../utils/xOfPin', './Selector'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('react'), require('react-dom'), require('not-defined'), require('../utils/computeNodeWidth'), require('./Link'), require('./Node'), require('./theme'), require('../utils/ignoreEvent'), require('../utils/xOfPin'), require('./Selector'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.react, global.reactDom, global.notDefined, global.computeNodeWidth, global.Link, global.Node, global.theme, global.ignoreEvent, global.xOfPin, global.Selector);
    global.Frame = mod.exports;
  }
})(this, function (module, exports, _react, _reactDom, _notDefined, _computeNodeWidth, _Link, _Node, _theme, _ignoreEvent, _xOfPin, _Selector) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  var _notDefined2 = _interopRequireDefault(_notDefined);

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

  var isShift = function isShift(code) {
    return code === 'ShiftLeft' || code === 'ShiftRight';
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
        dragging: false,
        offset: { x: 0, y: 0 },
        pointer: null,
        scroll: { x: 0, y: 0 },
        showSelector: false,
        selectedItems: [],
        shiftPressed: false
      };
      return _this;
    }

    _createClass(Frame, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        var _this2 = this;

        var _props = this.props,
            createInputPin = _props.createInputPin,
            createOutputPin = _props.createOutputPin,
            deleteInputPin = _props.deleteInputPin,
            deleteOutputPin = _props.deleteOutputPin,
            dragItems = _props.dragItems,
            view = _props.view;


        var setState = this.setState.bind(this);

        var container = (0, _reactDom.findDOMNode)(this).parentNode;

        document.addEventListener('keydown', function (_ref) {
          var code = _ref.code;
          var _state = _this2.state,
              selectedItems = _state.selectedItems,
              shiftPressed = _state.shiftPressed;


          if (isShift(code)) {
            setState({ shiftPressed: true });
          }

          if (code === 'Escape') {
            setState({ selectedItems: [] });
          }

          var selectedNodes = Object.keys(view.node).filter(function (id) {
            return selectedItems.indexOf(id) > -1;
          });

          if (selectedNodes.length > 0) {
            var draggingDelta = { x: 0, y: 0 };
            var unit = shiftPressed ? 1 : 10;

            if (code === 'ArrowLeft') draggingDelta.x = -unit;
            if (code === 'ArrowRight') draggingDelta.x = unit;
            if (code === 'ArrowUp') draggingDelta.y = -unit;
            if (code === 'ArrowDown') draggingDelta.y = unit;

            dragItems(draggingDelta, selectedNodes);
          }

          if (code === 'KeyI') {
            selectedItems.forEach(function (id) {
              if (view.node[id] && view.node[id].ins) {
                if (shiftPressed) {
                  deleteInputPin(id);
                } else {
                  createInputPin(id);
                }
              }
            });
          }

          if (code === 'KeyO') {
            selectedItems.forEach(function (id) {
              if (view.node[id] && view.node[id].outs) {
                if (shiftPressed) {
                  deleteOutputPin(id);
                } else {
                  createOutputPin(id);
                }
              }
            });
          }

          // Since state or props are not modified it is necessary to force update.
          _this2.forceUpdate();
        });

        document.addEventListener('keyup', function (_ref2) {
          var code = _ref2.code;

          if (isShift(code)) {
            setState({ shiftPressed: false });
          }
        });

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
        var _this3 = this;

        var _props2 = this.props,
            createInputPin = _props2.createInputPin,
            createLink = _props2.createLink,
            _createNode = _props2.createNode,
            createOutputPin = _props2.createOutputPin,
            deleteInputPin = _props2.deleteInputPin,
            deleteLink = _props2.deleteLink,
            deleteNode = _props2.deleteNode,
            deleteOutputPin = _props2.deleteOutputPin,
            dragItems = _props2.dragItems,
            fontSize = _props2.fontSize,
            item = _props2.item,
            model = _props2.model,
            nodeList = _props2.nodeList,
            theme = _props2.theme,
            updateLink = _props2.updateLink,
            view = _props2.view;
        var _state2 = this.state,
            draggedItems = _state2.draggedItems,
            draggedLinkId = _state2.draggedLinkId,
            pointer = _state2.pointer,
            dynamicView = _state2.dynamicView,
            selectedItems = _state2.selectedItems,
            showSelector = _state2.showSelector;
        var frameBorder = theme.frameBorder,
            fontFamily = theme.fontFamily,
            lineWidth = theme.lineWidth,
            nodeBodyHeight = theme.nodeBodyHeight,
            pinSize = theme.pinSize;


        var height = dynamicView.height || view.height;
        var width = dynamicView.width || view.width;

        // Remove border, otherwise also server side SVGx renders
        // miss the bottom and right border.
        var border = 1; // TODO frameBorder is 1px, make it dynamic
        height = height - 2 * border;
        width = width - 2 * border;

        var typeOfNode = item.util.typeOfNode;

        var Link = item.link.DefaultLink;

        var setState = this.setState.bind(this);

        var coordinatesOfLink = function coordinatesOfLink(_ref3) {
          var from = _ref3.from,
              to = _ref3.to;

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

            if ((0, _notDefined2.default)(source.outs)) source.outs = {};

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

            if ((0, _notDefined2.default)(target.ins)) target.ins = {};

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
          var _state3 = _this3.state,
              offset = _state3.offset,
              scroll = _state3.scroll;


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

          // TODO code here to start selectedArea dragging
          setState({
            selectedItems: []
          });
        };

        var onMouseLeave = function onMouseLeave(e) {
          e.preventDefault();
          e.stopPropagation();

          var draggedLinkId = _this3.state.draggedLinkId;
          if (draggedLinkId) delete view.link[draggedLinkId];

          setState({
            dragging: false,
            draggedLinkId: null,
            pointer: null,
            showSelector: false
          });
        };

        var onMouseMove = function onMouseMove(e) {
          e.preventDefault();
          e.stopPropagation();

          var _state4 = _this3.state,
              dragging = _state4.dragging,
              selectedItems = _state4.selectedItems;


          var nextPointer = getCoordinates(e);

          setState({
            pointer: nextPointer
          });

          if (dragging && selectedItems.length > 0) {
            var draggingDelta = {
              x: pointer ? nextPointer.x - pointer.x : 0,
              y: pointer ? nextPointer.y - pointer.y : 0
            };

            dragItems(draggingDelta, selectedItems);
          }
        };

        var onMouseUp = function onMouseUp(e) {
          e.preventDefault();
          e.stopPropagation();

          var draggedLinkId = _this3.state.draggedLinkId;

          if (draggedLinkId) {
            delete view.link[draggedLinkId];

            setState({
              draggedLinkId: null,
              pointer: null
            });
          } else {
            setState({
              dragging: false,
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

            var _state5 = _this3.state,
                draggedLinkId = _state5.draggedLinkId,
                shiftPressed = _state5.shiftPressed;


            // Do not select items when releasing a dragging link.

            if (draggedLinkId) {
              delete view.link[draggedLinkId];

              setState({ draggedLinkId: null });

              return;
            }

            var selectedItems = Object.assign([], _this3.state.selectedItems);

            var index = selectedItems.indexOf(id);

            var itemAlreadySelected = index > -1;

            // Shift key allows multiple selection.

            if (shiftPressed) {
              if (itemAlreadySelected) {
                selectedItems.splice(index, 1);
              } else {
                selectedItems.push(id);
              }
            } else {
              if (!itemAlreadySelected) {
                selectedItems = [id];
              }
            }

            setState({
              dragging: true,
              selectedItems: selectedItems
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
              multiSelection: selectedItems.length > 1,
              onCreateLink: onCreateLink,
              outs: outs,
              pinSize: pinSize,
              selected: selectedItems.indexOf(id) > -1,
              selectNode: selectItem(id),
              text: text,
              updateLink: onUpdateLink,
              width: width,
              x: x,
              y: y
            });
          }),
          Object.keys(view.link).map(function (id, i) {
            var _view$link$id = view.link[id],
                from = _view$link$id.from,
                to = _view$link$id.to;


            var coord = coordinatesOfLink(view.link[id]);
            var sourceSelected = from ? draggedItems.indexOf(from[0]) > -1 || selectedItems.indexOf(from[0]) > -1 : false;
            var targetSelected = to ? draggedItems.indexOf(to[0]) > -1 || selectedItems.indexOf(to[0]) > -1 : false;

            return _react2.default.createElement(Link, { key: i,
              deleteLink: deleteLink,
              from: from,
              lineWidth: lineWidth,
              id: id,
              onCreateLink: onCreateLink,
              startDraggingLinkTarget: startDraggingLinkTarget,
              pinSize: pinSize,
              selected: selectedItems.indexOf(id) > -1,
              selectLink: selectItem(id),
              sourceSelected: sourceSelected,
              targetSelected: targetSelected,
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
                showSelector: false
              });
            },
            nodeList: nodeList,
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