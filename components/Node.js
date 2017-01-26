(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', 'react', '../utils/ignoreEvent', '../utils/xOfPin', '../utils/computeNodeWidth', './theme'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('react'), require('../utils/ignoreEvent'), require('../utils/xOfPin'), require('../utils/computeNodeWidth'), require('./theme'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.react, global.ignoreEvent, global.xOfPin, global.computeNodeWidth, global.theme);
    global.Node = mod.exports;
  }
})(this, function (module, exports, _react, _ignoreEvent, _xOfPin, _computeNodeWidth, _theme) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  var _ignoreEvent2 = _interopRequireDefault(_ignoreEvent);

  var _xOfPin2 = _interopRequireDefault(_xOfPin);

  var _computeNodeWidth2 = _interopRequireDefault(_computeNodeWidth);

  var _theme2 = _interopRequireDefault(_theme);

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

  var Node = function (_Component) {
    _inherits(Node, _Component);

    function Node() {
      _classCallCheck(this, Node);

      return _possibleConstructorReturn(this, (Node.__proto__ || Object.getPrototypeOf(Node)).apply(this, arguments));
    }

    _createClass(Node, [{
      key: 'getBody',
      value: function getBody() {
        var _props = this.props,
            fontSize = _props.fontSize,
            theme = _props.theme,
            text = _props.text;
        var pinSize = theme.pinSize;


        var bodyHeight = this.props.bodyHeight || theme.nodeBodyHeight;

        // Heuristic value, based on Courier font.
        var margin = fontSize * 0.2;

        return _react2.default.createElement(
          'text',
          {
            x: pinSize,
            y: bodyHeight + pinSize - margin
          },
          _react2.default.createElement(
            'tspan',
            null,
            text
          )
        );
      }
    }, {
      key: 'render',
      value: function render() {
        var _props2 = this.props,
            createInputPin = _props2.createInputPin,
            createOutputPin = _props2.createOutputPin,
            deleteInputPin = _props2.deleteInputPin,
            deleteNode = _props2.deleteNode,
            deleteOutputPin = _props2.deleteOutputPin,
            dragged = _props2.dragged,
            draggedLinkId = _props2.draggedLinkId,
            fontSize = _props2.fontSize,
            id = _props2.id,
            ins = _props2.ins,
            onCreateLink = _props2.onCreateLink,
            outs = _props2.outs,
            selected = _props2.selected,
            selectNode = _props2.selectNode,
            text = _props2.text,
            theme = _props2.theme,
            updateLink = _props2.updateLink,
            width = _props2.width,
            willDragNode = _props2.willDragNode,
            x = _props2.x,
            y = _props2.y;
        var highlightColor = theme.highlightColor,
            nodeBarColor = theme.nodeBarColor,
            pinColor = theme.pinColor,
            pinSize = theme.pinSize;


        var bodyHeight = this.props.bodyHeight || theme.nodeBodyHeight;

        var bodyContent = this.getBody();

        var computedWidth = (0, _computeNodeWidth2.default)({
          bodyHeight: bodyHeight,
          pinSize: pinSize,
          fontSize: fontSize,
          node: { ins: ins, outs: outs, text: text, width: width }
        });

        return _react2.default.createElement(
          'g',
          {
            onDoubleClick: _ignoreEvent2.default,
            onMouseDown: willDragNode,
            onMouseUp: selectNode,
            style: {
              cursor: dragged ? 'pointer' : 'default'
            },
            transform: 'translate(' + x + ',' + y + ')'
          },
          selected ? _react2.default.createElement('path', {
            d: 'M 0 ' + pinSize / 3 + ' V ' + 2 * pinSize / 3 + ' H ' + pinSize / 3 + ' V ' + pinSize + ' H ' + 2 * pinSize / 3 + ' V ' + 2 * pinSize / 3 + ' H ' + pinSize + ' V ' + pinSize / 3 + ' H ' + 2 * pinSize / 3 + ' V ' + 0 + ' H ' + pinSize / 3 + ' V ' + pinSize / 3 + ' Z',
            fill: highlightColor,
            transform: 'translate(' + pinSize / 2 + ',' + pinSize / 2 + ') rotate(45) translate(' + -3 * pinSize / 2 + ',' + pinSize / 2 + ')',
            onMouseDown: function onMouseDown() {
              return deleteNode(id);
            }
          }) : null,
          selected ? _react2.default.createElement('path', {
            d: 'M 0 ' + pinSize / 3 + ' V ' + 2 * pinSize / 3 + ' H ' + pinSize + ' V ' + pinSize / 3 + ' Z',
            transform: 'translate(' + (computedWidth + 2) + ',0)',
            onMouseDown: function onMouseDown() {
              return deleteInputPin(id);
            },
            fill: highlightColor
          }) : null,
          selected ? _react2.default.createElement('path', {
            d: 'M 0 ' + pinSize / 3 + ' V ' + 2 * pinSize / 3 + ' H ' + pinSize / 3 + ' V ' + pinSize + ' H ' + 2 * pinSize / 3 + ' V ' + 2 * pinSize / 3 + ' H ' + pinSize + ' V ' + pinSize / 3 + ' H ' + 2 * pinSize / 3 + ' V ' + 0 + ' H ' + pinSize / 3 + ' V ' + pinSize / 3 + ' Z',
            transform: 'translate(' + (computedWidth + 4 + pinSize) + ',0)',
            onMouseDown: function onMouseDown() {
              return createInputPin(id);
            },
            fill: highlightColor
          }) : null,
          selected ? _react2.default.createElement('path', {
            d: 'M 0 ' + pinSize / 3 + ' V ' + 2 * pinSize / 3 + ' H ' + pinSize + ' V ' + pinSize / 3 + ' Z',
            transform: 'translate(' + (computedWidth + 2) + ',' + (bodyHeight + pinSize) + ')',
            onMouseDown: function onMouseDown() {
              return deleteOutputPin(id);
            },
            fill: highlightColor
          }) : null,
          selected ? _react2.default.createElement('path', {
            d: 'M 0 ' + pinSize / 3 + ' V ' + 2 * pinSize / 3 + ' H ' + pinSize / 3 + ' V ' + pinSize + ' H ' + 2 * pinSize / 3 + ' V ' + 2 * pinSize / 3 + ' H ' + pinSize + ' V ' + pinSize / 3 + ' H ' + 2 * pinSize / 3 + ' V ' + 0 + ' H ' + pinSize / 3 + ' V ' + pinSize / 3 + ' Z',
            transform: 'translate(' + (computedWidth + 4 + pinSize) + ',' + (bodyHeight + pinSize) + ')',
            onMouseDown: function onMouseDown() {
              return createOutputPin(id);
            },
            fill: highlightColor
          }) : null,
          _react2.default.createElement('rect', {
            fillOpacity: 0,
            height: bodyHeight + 2 * pinSize,
            stroke: selected || dragged ? highlightColor : nodeBarColor,
            strokeWidth: 1,
            width: computedWidth
          }),
          _react2.default.createElement('rect', {
            fill: selected || dragged ? highlightColor : nodeBarColor,
            height: pinSize,
            width: computedWidth
          }),
          ins.map(function (pin, i, array) {
            var x = (0, _xOfPin2.default)(pinSize, computedWidth, array.length, i);

            var onMouseUp = function onMouseUp(e) {
              e.preventDefault();
              e.stopPropagation();

              if (draggedLinkId) {
                updateLink(draggedLinkId, { to: [id, i] });
              }
            };

            return _react2.default.createElement('rect', {
              key: i,
              fill: pinColor,
              height: pinSize,
              onMouseDown: _ignoreEvent2.default,
              onMouseUp: onMouseUp,
              transform: 'translate(' + x + ',0)',
              width: pinSize
            });
          }),
          bodyContent,
          _react2.default.createElement('rect', {
            fill: selected || dragged ? highlightColor : nodeBarColor,
            height: pinSize,
            transform: 'translate(0,' + (pinSize + bodyHeight) + ')',
            width: computedWidth
          }),
          outs.map(function (pin, i, array) {
            var x = (0, _xOfPin2.default)(pinSize, computedWidth, array.length, i);

            var onMouseDown = function onMouseDown(e) {
              e.preventDefault();
              e.stopPropagation();

              onCreateLink({ from: [id, i], to: null });
            };

            return _react2.default.createElement('rect', {
              key: i,
              fill: pinColor,
              height: pinSize,
              onClick: _ignoreEvent2.default,
              onMouseLeave: _ignoreEvent2.default,
              onMouseDown: onMouseDown,
              transform: 'translate(' + x + ',' + (pinSize + bodyHeight) + ')',
              width: pinSize
            });
          })
        );
      }
    }]);

    return Node;
  }(_react.Component);

  Node.propTypes = {
    bodyHeight: _react.PropTypes.number,
    createInputPin: _react.PropTypes.func.isRequired,
    createOutputPin: _react.PropTypes.func.isRequired,
    deleteInputPin: _react.PropTypes.func.isRequired,
    deleteNode: _react.PropTypes.func.isRequired,
    deleteOutputPin: _react.PropTypes.func.isRequired,
    dragged: _react.PropTypes.bool.isRequired,
    draggedLinkId: _react.PropTypes.string,
    fontSize: _react.PropTypes.number.isRequired,
    id: _react.PropTypes.string,
    ins: _react.PropTypes.array.isRequired,
    outs: _react.PropTypes.array.isRequired,
    onCreateLink: _react.PropTypes.func.isRequired,
    selected: _react.PropTypes.bool.isRequired,
    selectNode: _react.PropTypes.func.isRequired,
    text: _react.PropTypes.string.isRequired,
    theme: _theme2.default.propTypes,
    updateLink: _react.PropTypes.func.isRequired,
    width: _react.PropTypes.number,
    willDragNode: _react.PropTypes.func.isRequired,
    x: _react.PropTypes.number.isRequired,
    y: _react.PropTypes.number.isRequired
  };

  Node.defaultProps = {
    createInputPin: Function.prototype,
    createOutputPin: Function.prototype,
    deleteInputPin: Function.prototype,
    deleteNode: Function.prototype,
    deleteOutputPin: Function.prototype,
    dragged: false, // TODO looks more like a state
    draggedLinkId: null,
    ins: [],
    onCreateLink: Function.prototype,
    outs: [],
    selected: false,
    selectNode: Function.prototype,
    text: 'Node',
    theme: _theme2.default.defaultProps,
    updateLink: Function.prototype,
    willDragNode: Function.prototype
  };

  exports.default = Node;
  module.exports = exports['default'];
});