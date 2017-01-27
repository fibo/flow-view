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


        var bodyHeight = this.getBodyHeight();

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
      key: 'getBodyHeight',
      value: function getBodyHeight() {
        var _props2 = this.props,
            bodyHeight = _props2.bodyHeight,
            theme = _props2.theme;


        return bodyHeight || theme.nodeBodyHeight;
      }
    }, {
      key: 'getComputedWidth',
      value: function getComputedWidth() {
        var _props3 = this.props,
            fontSize = _props3.fontSize,
            ins = _props3.ins,
            outs = _props3.outs,
            text = _props3.text,
            theme = _props3.theme,
            width = _props3.width;
        var pinSize = theme.pinSize;


        var bodyHeight = this.getBodyHeight();

        var computedWidth = (0, _computeNodeWidth2.default)({
          bodyHeight: bodyHeight,
          pinSize: pinSize,
          fontSize: fontSize,
          node: { ins: ins, outs: outs, text: text, width: width }
        });

        return computedWidth;
      }
    }, {
      key: 'getDeleteButton',
      value: function getDeleteButton() {
        var _props4 = this.props,
            deleteNode = _props4.deleteNode,
            id = _props4.id,
            theme = _props4.theme;
        var highlightColor = theme.highlightColor,
            pinSize = theme.pinSize;


        return _react2.default.createElement('path', {
          d: 'M 0 ' + pinSize / 3 + ' V ' + 2 * pinSize / 3 + ' H ' + pinSize / 3 + ' V ' + pinSize + ' H ' + 2 * pinSize / 3 + ' V ' + 2 * pinSize / 3 + ' H ' + pinSize + ' V ' + pinSize / 3 + ' H ' + 2 * pinSize / 3 + ' V ' + 0 + ' H ' + pinSize / 3 + ' V ' + pinSize / 3 + ' Z',
          fill: highlightColor,
          transform: 'translate(' + pinSize / 2 + ',' + pinSize / 2 + ') rotate(45) translate(' + -3 * pinSize / 2 + ',' + pinSize / 2 + ')',
          onMouseDown: function onMouseDown() {
            return deleteNode(id);
          }
        });
      }
    }, {
      key: 'getInputMinus',
      value: function getInputMinus() {
        var _props5 = this.props,
            deleteInputPin = _props5.deleteInputPin,
            id = _props5.id,
            ins = _props5.ins,
            theme = _props5.theme;
        var highlightColor = theme.highlightColor,
            pinSize = theme.pinSize;


        if (ins.length === 0) return null;

        var computedWidth = this.getComputedWidth();

        return _react2.default.createElement('path', {
          d: 'M 0 ' + pinSize / 3 + ' V ' + 2 * pinSize / 3 + ' H ' + pinSize + ' V ' + pinSize / 3 + ' Z',
          transform: 'translate(' + (computedWidth + 2) + ',0)',
          onMouseDown: function onMouseDown() {
            return deleteInputPin(id);
          },
          fill: highlightColor
        });
      }
    }, {
      key: 'getInputPlus',
      value: function getInputPlus() {
        var _props6 = this.props,
            createInputPin = _props6.createInputPin,
            id = _props6.id,
            theme = _props6.theme;
        var highlightColor = theme.highlightColor,
            pinSize = theme.pinSize;


        var computedWidth = this.getComputedWidth();

        return _react2.default.createElement('path', {
          d: 'M 0 ' + pinSize / 3 + ' V ' + 2 * pinSize / 3 + ' H ' + pinSize / 3 + ' V ' + pinSize + ' H ' + 2 * pinSize / 3 + ' V ' + 2 * pinSize / 3 + ' H ' + pinSize + ' V ' + pinSize / 3 + ' H ' + 2 * pinSize / 3 + ' V ' + 0 + ' H ' + pinSize / 3 + ' V ' + pinSize / 3 + ' Z',
          transform: 'translate(' + (computedWidth + 4 + pinSize) + ',0)',
          onMouseDown: function onMouseDown() {
            return createInputPin(id);
          },
          fill: highlightColor
        });
      }
    }, {
      key: 'getOutputMinus',
      value: function getOutputMinus() {
        var _props7 = this.props,
            deleteOutputPin = _props7.deleteOutputPin,
            id = _props7.id,
            outs = _props7.outs,
            theme = _props7.theme;


        if (outs.length === 0) return null;

        var highlightColor = theme.highlightColor,
            pinSize = theme.pinSize;


        var bodyHeight = this.getBodyHeight();
        var computedWidth = this.getComputedWidth();

        return _react2.default.createElement('path', {
          d: 'M 0 ' + pinSize / 3 + ' V ' + 2 * pinSize / 3 + ' H ' + pinSize + ' V ' + pinSize / 3 + ' Z',
          transform: 'translate(' + (computedWidth + 2) + ',' + (bodyHeight + pinSize) + ')',
          onMouseDown: function onMouseDown() {
            return deleteOutputPin(id);
          },
          fill: highlightColor
        });
      }
    }, {
      key: 'getOutputPlus',
      value: function getOutputPlus() {
        var _props8 = this.props,
            createOutputPin = _props8.createOutputPin,
            id = _props8.id,
            theme = _props8.theme;
        var highlightColor = theme.highlightColor,
            pinSize = theme.pinSize;


        var bodyHeight = this.getBodyHeight();
        var computedWidth = this.getComputedWidth();

        return _react2.default.createElement('path', {
          d: 'M 0 ' + pinSize / 3 + ' V ' + 2 * pinSize / 3 + ' H ' + pinSize / 3 + ' V ' + pinSize + ' H ' + 2 * pinSize / 3 + ' V ' + 2 * pinSize / 3 + ' H ' + pinSize + ' V ' + pinSize / 3 + ' H ' + 2 * pinSize / 3 + ' V ' + 0 + ' H ' + pinSize / 3 + ' V ' + pinSize / 3 + ' Z',
          transform: 'translate(' + (computedWidth + 4 + pinSize) + ',' + (bodyHeight + pinSize) + ')',
          onMouseDown: function onMouseDown() {
            return createOutputPin(id);
          },
          fill: highlightColor
        });
      }
    }, {
      key: 'render',
      value: function render() {
        var _props9 = this.props,
            dragged = _props9.dragged,
            draggedLinkId = _props9.draggedLinkId,
            id = _props9.id,
            ins = _props9.ins,
            onCreateLink = _props9.onCreateLink,
            outs = _props9.outs,
            selected = _props9.selected,
            selectNode = _props9.selectNode,
            theme = _props9.theme,
            updateLink = _props9.updateLink,
            willDragNode = _props9.willDragNode,
            x = _props9.x,
            y = _props9.y;
        var highlightColor = theme.highlightColor,
            nodeBarColor = theme.nodeBarColor,
            pinColor = theme.pinColor,
            pinSize = theme.pinSize;


        var bodyContent = this.getBody();
        var bodyHeight = this.getBodyHeight();
        var computedWidth = this.getComputedWidth();

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
          selected ? this.getDeleteButton() : null,
          selected ? this.getInputMinus() : null,
          selected ? this.getInputPlus() : null,
          selected ? this.getOutputMinus() : null,
          selected ? this.getOutputPlus() : null,
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