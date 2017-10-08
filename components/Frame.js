'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _bindme = require('bindme');

var _bindme2 = _interopRequireDefault(_bindme);

var _notDefined = require('not-defined');

var _notDefined2 = _interopRequireDefault(_notDefined);

var _Link = require('./Link');

var _Link2 = _interopRequireDefault(_Link);

var _Node = require('./Node');

var _Node2 = _interopRequireDefault(_Node);

var _RectangularSelection = require('./RectangularSelection');

var _RectangularSelection2 = _interopRequireDefault(_RectangularSelection);

var _Selector = require('./Selector');

var _Selector2 = _interopRequireDefault(_Selector);

var _computeNodeWidth = require('../utils/computeNodeWidth');

var _computeNodeWidth2 = _interopRequireDefault(_computeNodeWidth);

var _randomString = require('../utils/randomString');

var _randomString2 = _interopRequireDefault(_randomString);

var _ignoreEvent = require('../utils/ignoreEvent');

var _ignoreEvent2 = _interopRequireDefault(_ignoreEvent);

var _xOfPin = require('../utils/xOfPin');

var _xOfPin2 = _interopRequireDefault(_xOfPin);

var _theme = require('./theme');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Frame = function (_React$Component) {
  _inherits(Frame, _React$Component);

  function Frame(props) {
    var _this;

    _classCallCheck(this, Frame);

    (0, _bindme2.default)((_this = _possibleConstructorReturn(this, (Frame.__proto__ || Object.getPrototypeOf(Frame)).call(this, props)), _this), 'connectLinkToTarget', 'createLink', 'createNode', 'createInputPin', 'createOutputPin', 'deleteInputPin', 'deleteOutputPin', 'deleteLink', 'deleteNode', 'onClick', 'onDocumentKeydown', 'onDocumentKeyup', 'onDoubleClick', 'onMouseDown', 'onMouseLeave', 'onMouseMove', 'onMouseUp', 'onWindowResize', 'onWindowScroll', 'selectorCreateNode', 'selectItem', 'startDraggingLinkTarget');

    _this.state = {
      dynamicView: { height: null, width: null },
      draggedLinkId: null,
      isMouseDown: false,
      offset: { x: 0, y: 0 },
      pointer: null,
      rectangularSelection: null,
      scroll: { x: 0, y: 0 },
      showSelector: false,
      selectedItems: [],
      shiftPressed: false,
      view: props.view
    };
    return _this;
  }

  _createClass(Frame, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var container = _reactDom2.default.findDOMNode(this).parentNode;

      document.addEventListener('keydown', this.onDocumentKeydown);
      document.addEventListener('keyup', this.onDocumentKeyup);

      window.addEventListener('scroll', this.onWindowScroll);
      window.addEventListener('resize', this.onWindowResize(container));

      var offset = {
        x: container.offsetLeft,
        y: container.offsetTop
      };

      var scroll = {
        x: window.scrollX,
        y: window.scrollY
      };

      this.setState({ offset: offset, scroll: scroll });
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      var container = _reactDom2.default.findDOMNode(this).parentNode;

      document.removeEventListener('keydown', this.onDocumentKeydown);
      document.removeEventListener('keyup', this.onDocumentKeyup);

      window.removeEventListener('scroll', this.onWindowScroll);
      window.removeEventListener('resize', this.onWindowResize(container));
    }
  }, {
    key: 'connectLinkToTarget',
    value: function connectLinkToTarget(linkId, target) {
      var view = Object.assign({}, this.state.view);

      view.link[linkId].to = target;

      this.setState({
        draggedLinkId: null,
        view: view
      });

      this.props.emitCreateLink(view.link[linkId], linkId);
    }
  }, {
    key: 'coordinatesOfLink',
    value: function coordinatesOfLink(_ref) {
      var from = _ref.from,
          to = _ref.to;
      var theme = this.props.theme;
      var _state = this.state,
          pointer = _state.pointer,
          view = _state.view;
      var fontSize = theme.fontSize,
          nodeBodyHeight = theme.nodeBodyHeight,
          pinSize = theme.pinSize;


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
        x2 = pointer ? pointer.x - pinSize / 2 : x1;
        y2 = pointer ? pointer.y - pinSize : y1;
      }

      return { x1: x1, y1: y1, x2: x2, y2: y2 };
    }
  }, {
    key: 'createInputPin',
    value: function createInputPin(nodeId, pin) {
      var view = Object.assign({}, this.state.view);

      var ins = view.node[nodeId].ins || [];

      var position = view.node[nodeId].ins.length;

      if ((0, _notDefined2.default)(pin)) pin = 'in' + position;

      ins.push(pin);

      view.node[nodeId].ins = ins;

      this.setState({ view: view });

      this.props.emitCreateInputPin([nodeId, position], pin);
    }
  }, {
    key: 'createLink',
    value: function createLink(link) {
      var view = Object.assign({}, this.state.view);

      var id = this.generateId();

      var newLink = {};
      newLink[id] = link;

      view.link[id] = link;

      if (link.to) {
        this.setState({
          draggedLinkId: null,
          selectedItems: [],
          view: view
        });
        this.props.emitCreateLink(link, id);
      } else {
        this.setState({
          draggedLinkId: id,
          isMouseDown: true,
          selectedItems: [],
          view: view
        });
      }

      return id;
    }
  }, {
    key: 'createNode',
    value: function createNode(node) {
      var view = Object.assign({}, this.state.view);

      var id = this.generateId();

      view.node[id] = node;

      this.setState({ view: view });

      this.props.emitCreateNode(node, id);

      return id;
    }
  }, {
    key: 'createOutputPin',
    value: function createOutputPin(nodeId, pin) {
      var view = Object.assign({}, this.state.view);

      var outs = view.node[nodeId].outs || [];

      var position = view.node[nodeId].outs.length;

      if ((0, _notDefined2.default)(pin)) pin = 'out' + position;

      outs.push(pin);

      view.node[nodeId].outs = outs;

      this.setState({ view: view });

      this.props.emitCreateOutputPin([nodeId, position], pin);
    }
  }, {
    key: 'deleteInputPin',
    value: function deleteInputPin(nodeId, position) {
      var _this2 = this;

      var view = Object.assign({}, this.state.view);

      var ins = view.node[nodeId].ins;

      if ((0, _notDefined2.default)(ins)) return;
      if (ins.length === 0) return;

      if ((0, _notDefined2.default)(position)) position = ins.length - 1;

      Object.keys(view.link).forEach(function (id) {
        var to = view.link[id].to;

        if ((0, _notDefined2.default)(to)) return;

        if (to[0] === nodeId && to[1] === position) {
          _this2.deleteLink(id);
        }
      });

      view.node[nodeId].ins.splice(position, 1);

      this.setState({ view: view });

      this.props.emitDeleteInputPin([nodeId, position]);
    }
  }, {
    key: 'deleteOutputPin',
    value: function deleteOutputPin(nodeId, position) {
      var _this3 = this;

      var view = Object.assign({}, this.state.view);

      var outs = view.node[nodeId].outs;

      if ((0, _notDefined2.default)(outs)) return;
      if (outs.length === 0) return;

      if ((0, _notDefined2.default)(position)) position = outs.length - 1;

      Object.keys(view.link).forEach(function (id) {
        var from = view.link[id].from;

        if ((0, _notDefined2.default)(from)) return;

        if (from[0] === nodeId && from[1] === position) {
          _this3.deleteLink(id);
        }
      });

      view.node[nodeId].outs.splice(position, 1);

      this.setState({ view: view });

      this.props.emitDeleteOutputPin([nodeId, position]);
    }
  }, {
    key: 'deleteLink',
    value: function deleteLink(id) {
      var view = Object.assign({}, this.state.view);

      delete view.link[id];

      this.setState({ view: view });

      this.props.emitDeleteLink(id);
    }
  }, {
    key: 'deleteNode',
    value: function deleteNode(id) {
      var _this4 = this;

      var view = Object.assign({}, this.state.view);

      Object.keys(view.link).forEach(function (linkId) {
        var from = view.link[linkId].from;
        var to = view.link[linkId].to;

        if (from && from[0] === id) {
          _this4.deleteLink(linkId);
        }

        if (to && to[0] === id) {
          _this4.deleteLink(linkId);
        }
      });

      delete view.node[id];

      this.setState({ view: view });

      this.props.emitDeleteNode(id);
    }
  }, {
    key: 'dragItems',
    value: function dragItems(dragginDelta, draggedItems) {
      var view = Object.assign({}, this.state.view);

      Object.keys(view.node).filter(function (id) {
        return draggedItems.indexOf(id) > -1;
      }).forEach(function (id) {
        view.node[id].x += dragginDelta.x;
        view.node[id].y += dragginDelta.y;
      });

      this.setState({ view: view });
    }
  }, {
    key: 'generateId',
    value: function generateId() {
      var view = this.state.view;


      var id = (0, _randomString2.default)(3);

      return view.link[id] || view.node[id] ? this.generateId() : id;
    }
  }, {
    key: 'getCoordinates',
    value: function getCoordinates(event) {
      var _state2 = this.state,
          offset = _state2.offset,
          scroll = _state2.scroll;


      return {
        x: event.clientX - offset.x + scroll.x,
        y: event.clientY - offset.y + scroll.y
      };
    }
  }, {
    key: 'onClick',
    value: function onClick(event) {
      event.preventDefault();
      event.stopPropagation();

      this.setState({ showSelector: false });
    }
  }, {
    key: 'onDocumentKeydown',
    value: function onDocumentKeydown(event) {
      var _this5 = this;

      var code = event.code;
      var _state3 = this.state,
          selectedItems = _state3.selectedItems,
          shiftPressed = _state3.shiftPressed,
          view = _state3.view;


      var selectedNodes = this.selectedNodes();
      var thereAreSelectedNodes = selectedNodes.length > 0;

      var draggingDelta = { x: 0, y: 0 };
      var unit = shiftPressed ? 1 : 10;

      switch (code) {
        case 'ArrowDown':
          if (thereAreSelectedNodes) draggingDelta.y = unit;
          break;

        case 'ArrowLeft':
          if (thereAreSelectedNodes) draggingDelta.x = -unit;
          break;

        case 'ArrowRight':
          if (thereAreSelectedNodes) draggingDelta.x = unit;
          break;

        case 'ArrowUp':
          if (thereAreSelectedNodes) draggingDelta.y = -unit;
          break;

        case 'Backspace':
          if (thereAreSelectedNodes) {
            selectedNodes.forEach(this.deleteNode);
          }
          break;

        case 'Escape':
          this.setState({ selectedItems: [] });
          break;

        case 'KeyI':
          selectedItems.forEach(function (id) {
            if (view.node[id] && view.node[id].ins) {
              if (shiftPressed) {
                _this5.deleteInputPin(id);
              } else {
                _this5.createInputPin(id);
              }
            }
          });
          break;

        case 'KeyO':
          selectedItems.forEach(function (id) {
            if (view.node[id] && view.node[id].outs) {
              if (shiftPressed) {
                _this5.deleteOutputPin(id);
              } else {
                _this5.createOutputPin(id);
              }
            }
          });
          break;

        case 'ShiftLeft':
        case 'ShiftRight':
          this.setState({ shiftPressed: true });

          break;

        default:
          break;
      }

      if (thereAreSelectedNodes && code.substring(0, 5) === 'Arrow') {
        this.dragItems(draggingDelta, selectedNodes);
      }
    }
  }, {
    key: 'onDocumentKeyup',
    value: function onDocumentKeyup(event) {
      var code = event.code;


      switch (code) {
        case 'ShiftLeft':
        case 'ShiftRight':
          this.setState({ shiftPressed: false });
          break;

        default:
          break;
      }
    }
  }, {
    key: 'onDoubleClick',
    value: function onDoubleClick(event) {
      event.preventDefault();
      event.stopPropagation();

      var pointer = this.getCoordinates(event);

      this.setState({
        pointer: pointer,
        showSelector: true
      });
    }
  }, {
    key: 'onMouseDown',
    value: function onMouseDown(event) {
      event.preventDefault();
      event.stopPropagation();

      var pointer = this.getCoordinates(event);

      this.setState({
        isMouseDown: true,
        rectangularSelection: {
          x: pointer.x,
          y: pointer.y,
          height: 0,
          width: 0
        },
        selectedItems: []
      });
    }
  }, {
    key: 'onMouseLeave',
    value: function onMouseLeave(event) {
      event.preventDefault();
      event.stopPropagation();

      var _state4 = this.state,
          draggedLinkId = _state4.draggedLinkId,
          view = _state4.view;


      var link = Object.assign({}, view.link);

      if (draggedLinkId) delete link[draggedLinkId];

      this.setState({
        draggedLinkId: null,
        isMouseDown: false,
        pointer: null,
        rectangularSelection: null,
        showSelector: false,
        view: Object.assign({}, view, { link: link })
      });
    }
  }, {
    key: 'onMouseMove',
    value: function onMouseMove(event) {
      event.preventDefault();
      event.stopPropagation();

      var _state5 = this.state,
          isMouseDown = _state5.isMouseDown,
          pointer = _state5.pointer,
          rectangularSelection = _state5.rectangularSelection,
          selectedItems = _state5.selectedItems;


      if (!isMouseDown) return;

      var nextPointer = this.getCoordinates(event);

      var draggingDelta = {
        x: pointer ? nextPointer.x - pointer.x : 0,
        y: pointer ? nextPointer.y - pointer.y : 0
      };

      if (selectedItems.length > 0) {
        this.dragItems(draggingDelta, selectedItems);
      }

      if (rectangularSelection) {
        this.setState({
          rectangularSelection: Object.assign({}, rectangularSelection, {
            height: nextPointer.y - rectangularSelection.y,
            width: nextPointer.x - rectangularSelection.x
          })
        });
      }

      this.setState({ pointer: nextPointer });
    }
  }, {
    key: 'onMouseUp',
    value: function onMouseUp(event) {
      event.preventDefault();
      event.stopPropagation();

      var _state6 = this.state,
          draggedLinkId = _state6.draggedLinkId,
          rectangularSelection = _state6.rectangularSelection;


      var view = Object.assign({}, this.state.view);

      if (draggedLinkId) {
        delete view.link[draggedLinkId];

        this.setState({
          draggedLinkId: null,
          isMouseDown: false,
          pointer: null,
          rectangularSelection: null,
          selectedItems: [],
          view: Object.assign({}, view)
        });
      }

      if (rectangularSelection) {
        var _selectedItems = [];

        var boundsX = rectangularSelection.width >= 0 ? rectangularSelection.x : rectangularSelection.x + rectangularSelection.width;
        var boundsY = rectangularSelection.height >= 0 ? rectangularSelection.y : rectangularSelection.y + rectangularSelection.height;

        Object.keys(view.node).forEach(function (nodeId) {
          var _view$node$nodeId = view.node[nodeId],
              x = _view$node$nodeId.x,
              y = _view$node$nodeId.y;


          var isInside = x >= boundsX && y >= boundsY;

          if (isInside) {
            _selectedItems.push(nodeId);
          }
        });

        this.setState({
          draggedLinkId: null,
          isMouseDown: false,
          pointer: null,
          selectedItems: _selectedItems,
          rectangularSelection: null
        });
      }

      this.setState({
        draggedLinkId: null,
        isMouseDown: false,
        pointer: null
      });
    }
  }, {
    key: 'onWindowResize',
    value: function onWindowResize(container) {
      var _this6 = this;

      return function () {
        var rect = container.getBoundingClientRect();

        var dynamicView = {
          height: rect.height,
          width: rect.width
        };

        _this6.setState({ dynamicView: dynamicView });
      };
    }
  }, {
    key: 'onWindowScroll',
    value: function onWindowScroll() {
      var scroll = {
        x: window.scrollX,
        y: window.scrollY
      };

      this.setState({ scroll: scroll });
    }
  }, {
    key: 'selectedNodes',
    value: function selectedNodes() {
      var _state7 = this.state,
          view = _state7.view,
          selectedItems = _state7.selectedItems;


      var selectedNodes = Object.keys(view.node).filter(function (id) {
        return selectedItems.indexOf(id) > -1;
      });

      return selectedNodes;
    }
  }, {
    key: 'selectorCreateNode',
    value: function selectorCreateNode(node) {
      var id = this.createNode(node);

      this.setState({
        selectedItems: [id],
        showSelector: false
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this7 = this;

      var _props = this.props,
          item = _props.item,
          model = _props.model,
          responsive = _props.responsive,
          theme = _props.theme;
      var _state8 = this.state,
          draggedLinkId = _state8.draggedLinkId,
          dynamicView = _state8.dynamicView,
          pointer = _state8.pointer,
          rectangularSelection = _state8.rectangularSelection,
          selectedItems = _state8.selectedItems,
          showSelector = _state8.showSelector,
          view = _state8.view;
      var frameBorder = theme.frameBorder,
          fontFamily = theme.fontFamily,
          fontSize = theme.fontSize,
          lineWidth = theme.lineWidth,
          pinSize = theme.pinSize,
          primaryColor = theme.primaryColor;


      var height = dynamicView.height || view.height;
      var width = dynamicView.width || view.width;

      var border = 1;
      height = height - 2 * border;
      width = width - 2 * border;

      var selectedFirst = function selectedFirst(a, b) {
        var aIsSelected = selectedItems.indexOf(a) > -1;
        var bIsSelected = selectedItems.indexOf(b) > -1;

        if (aIsSelected && bIsSelected) return 0;

        if (aIsSelected) return 1;
        if (bIsSelected) return -1;
      };

      return _react2.default.createElement(
        'svg',
        {
          fontFamily: fontFamily,
          fontSize: fontSize,
          height: responsive ? null : height,
          onClick: this.onClick,
          onDoubleClick: this.onDoubleClick,
          onMouseDown: this.onMouseDown,
          onMouseEnter: _ignoreEvent2.default,
          onMouseLeave: this.onMouseLeave,
          onMouseMove: this.onMouseMove,
          onMouseUp: this.onMouseUp,
          textAnchor: 'start',
          style: { border: frameBorder },
          viewBox: responsive ? '0 0 ' + width + ' ' + height : null,
          width: responsive ? null : width
        },
        rectangularSelection ? _react2.default.createElement(_RectangularSelection2.default, _extends({
          color: primaryColor
        }, rectangularSelection)) : null,
        Object.keys(view.link).map(function (id, i) {
          var _view$link$id = view.link[id],
              from = _view$link$id.from,
              to = _view$link$id.to;


          var coord = _this7.coordinatesOfLink(view.link[id]);
          var sourceSelected = from ? selectedItems.indexOf(from[0]) > -1 : false;
          var targetSelected = to ? selectedItems.indexOf(to[0]) > -1 : false;

          return _react2.default.createElement(_Link2.default, { key: i,
            deleteLink: _this7.deleteLink,
            from: from,
            lineWidth: lineWidth,
            id: id,
            createLink: _this7.createLink,
            startDraggingLinkTarget: _this7.startDraggingLinkTarget,
            pinSize: pinSize,
            selected: selectedItems.indexOf(id) > -1,
            selectLink: _this7.selectItem(id),
            sourceSelected: sourceSelected,
            targetSelected: targetSelected,
            to: to,
            x1: coord.x1,
            y1: coord.y1,
            x2: coord.x2,
            y2: coord.y2
          });
        }),
        Object.keys(view.node).sort(selectedFirst).map(function (id, i) {
          var node = view.node[id];

          var height = node.height,
              ins = node.ins,
              outs = node.outs,
              text = node.text,
              width = node.width,
              x = node.x,
              y = node.y;


          var nodeType = item.util.typeOfNode(node);
          var Node = item.node[nodeType];

          return _react2.default.createElement(Node, { key: i,
            connectLinkToTarget: _this7.connectLinkToTarget,
            createInputPin: _this7.createInputPin,
            createLink: _this7.createLink,
            createOutputPin: _this7.createOutputPin,
            draggedLinkId: draggedLinkId,
            deleteInputPin: _this7.deleteInputPin,
            deleteNode: _this7.deleteNode,
            deleteOutputPin: _this7.deleteOutputPin,
            fontSize: fontSize,
            height: height,
            id: id,
            ins: ins,
            model: model,
            multiSelection: selectedItems.length > 1,
            outs: outs,
            pinSize: pinSize,
            selected: selectedItems.indexOf(id) > -1,
            selectNode: _this7.selectItem(id),
            text: text,
            width: width,
            x: x,
            y: y
          });
        }),
        _react2.default.createElement(_Selector2.default, {
          createNode: this.selectorCreateNode,
          nodeList: item.nodeList,
          pointer: showSelector ? pointer : null,
          show: showSelector
        })
      );
    }
  }, {
    key: 'selectItem',
    value: function selectItem(id) {
      var _this8 = this;

      return function (event) {
        event.preventDefault();
        event.stopPropagation();

        var _state9 = _this8.state,
            draggedLinkId = _state9.draggedLinkId,
            shiftPressed = _state9.shiftPressed;


        var selectedItems = [].concat(_toConsumableArray(_this8.state.selectedItems));
        var view = Object.assign({}, _this8.state.view);

        if (draggedLinkId) {
          delete view.link[draggedLinkId];

          _this8.setState({
            draggedLinkId: null,
            view: view
          });

          return;
        }

        var index = selectedItems.indexOf(id);

        var itemAlreadySelected = index > -1;

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

        _this8.setState({
          isMouseDown: true,
          selectedItems: selectedItems
        });
      };
    }
  }, {
    key: 'startDraggingLinkTarget',
    value: function startDraggingLinkTarget(id) {
      var from = this.state.view.link[id].from;

      this.deleteLink(id);

      var draggedLinkId = this.createLink({ from: from });
      this.setState({ draggedLinkId: draggedLinkId });
    }
  }]);

  return Frame;
}(_react2.default.Component);

exports.default = Frame;


Frame.defaultProps = {
  emitCreateInputPin: Function.prototype,
  emitCreateLink: Function.prototype,
  emitCreateNode: Function.prototype,
  emitCreateOutputPin: Function.prototype,
  emitDeleteInputPin: Function.prototype,
  emitDeleteLink: Function.prototype,
  emitDeleteNode: Function.prototype,
  emitDeleteOutputPin: Function.prototype,
  item: {
    node: { DefaultNode: _Node2.default },
    nodeList: [],
    util: {
      typeOfNode: function typeOfNode(node) {
        return 'DefaultNode';
      }
    }
  },
  responsive: false,
  theme: _theme.defaultTheme,
  updateLink: Function.prototype,
  view: {
    link: {},
    node: {}
  }
};