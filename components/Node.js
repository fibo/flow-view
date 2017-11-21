'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _bindme = require('bindme');

var _bindme2 = _interopRequireDefault(_bindme);

var _theme = require('./theme');

var _CrossButton = require('./CrossButton');

var _CrossButton2 = _interopRequireDefault(_CrossButton);

var _MinusButton = require('./MinusButton');

var _MinusButton2 = _interopRequireDefault(_MinusButton);

var _PlusButton = require('./PlusButton');

var _PlusButton2 = _interopRequireDefault(_PlusButton);

var _InputPin = require('./InputPin');

var _InputPin2 = _interopRequireDefault(_InputPin);

var _OutputPin = require('./OutputPin');

var _OutputPin2 = _interopRequireDefault(_OutputPin);

var _computeNodeWidth = require('../utils/computeNodeWidth');

var _computeNodeWidth2 = _interopRequireDefault(_computeNodeWidth);

var _ignoreEvent = require('../utils/ignoreEvent');

var _ignoreEvent2 = _interopRequireDefault(_ignoreEvent);

var _xOfPin = require('../utils/xOfPin');

var _xOfPin2 = _interopRequireDefault(_xOfPin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Node = function (_React$Component) {
  _inherits(Node, _React$Component);

  function Node() {
    var _this;

    _classCallCheck(this, Node);

    (0, _bindme2.default)((_this = _possibleConstructorReturn(this, (Node.__proto__ || Object.getPrototypeOf(Node)).call(this)), _this), 'createInputPin', 'createOutputPin', 'deleteInputPin', 'deleteNode', 'deleteOutputPin');
    return _this;
  }

  _createClass(Node, [{
    key: 'createInputPin',
    value: function createInputPin() {
      this.props.createInputPin(this.props.id);
    }
  }, {
    key: 'createOutputPin',
    value: function createOutputPin() {
      this.props.createOutputPin(this.props.id);
    }
  }, {
    key: 'deleteInputPin',
    value: function deleteInputPin() {
      this.props.deleteInputPin(this.props.id);
    }
  }, {
    key: 'deleteNode',
    value: function deleteNode() {
      this.props.deleteNode(this.props.id);
    }
  }, {
    key: 'deleteOutputPin',
    value: function deleteOutputPin() {
      this.props.deleteOutputPin(this.props.id);
    }
  }, {
    key: 'getComputedWidth',
    value: function getComputedWidth() {
      var _props = this.props,
          ins = _props.ins,
          outs = _props.outs,
          text = _props.text,
          theme = _props.theme,
          width = _props.width;


      var fontSize = theme.frame.font.size;

      var pinSize = theme.node.pin.size;

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
    key: 'getBodyHeight',
    value: function getBodyHeight() {
      var _props2 = this.props,
          bodyHeight = _props2.bodyHeight,
          theme = _props2.theme;


      return bodyHeight || theme.node.body.height;
    }
  }, {
    key: 'render',
    value: function render() {
      var _props3 = this.props,
          dragging = _props3.dragging,
          draggedLinkId = _props3.draggedLinkId,
          id = _props3.id,
          ins = _props3.ins,
          connectLinkToTarget = _props3.connectLinkToTarget,
          createLink = _props3.createLink,
          outs = _props3.outs,
          selected = _props3.selected,
          selectNode = _props3.selectNode,
          theme = _props3.theme,
          x = _props3.x,
          y = _props3.y;


      var darkColor = theme.frame.color.dark;
      var primaryColor = theme.frame.color.primary;

      var baseColor = theme.node.color;
      var bodyColor = theme.node.body.color;
      var pinColor = theme.node.pin.color;
      var pinSize = theme.node.pin.size;

      var bodyHeight = this.getBodyHeight();
      var computedWidth = this.getComputedWidth();

      return _react2.default.createElement(
        'g',
        {
          onDoubleClick: _ignoreEvent2.default,
          onMouseDown: selectNode,
          style: {
            cursor: dragging ? 'pointer' : 'default'
          },
          transform: 'translate(' + x + ',' + y + ')'
        },
        this.renderDeleteButton(),
        this.renderInputMinus(),
        this.renderInputPlus(),
        this.renderOutputMinus(),
        this.renderOutputPlus(),
        _react2.default.createElement('rect', {
          fill: bodyColor,
          height: bodyHeight + 2 * pinSize,
          stroke: selected ? primaryColor : baseColor,
          strokeWidth: 1,
          width: computedWidth
        }),
        _react2.default.createElement('rect', {
          fill: selected ? primaryColor : baseColor,
          height: pinSize,
          width: computedWidth
        }),
        ins && ins.map(function (pin, i, array) {
          var x = (0, _xOfPin2.default)(pinSize, computedWidth, array.length, i);

          return _react2.default.createElement(_InputPin2.default, { key: i,
            color: selected ? darkColor : pinColor,
            draggedLinkId: draggedLinkId,
            nodeIdAndPosition: [id, i],
            connectLinkToTarget: connectLinkToTarget,
            size: pinSize,
            x: x,
            y: 0
          });
        }),
        this.renderBody(),
        _react2.default.createElement('rect', {
          fill: selected ? primaryColor : baseColor,
          height: pinSize,
          transform: 'translate(0,' + (pinSize + bodyHeight) + ')',
          width: computedWidth
        }),
        outs && outs.map(function (pin, i, array) {
          var x = (0, _xOfPin2.default)(pinSize, computedWidth, array.length, i);

          return _react2.default.createElement(_OutputPin2.default, { key: i,
            color: selected ? darkColor : pinColor,
            createLink: createLink,
            nodeIdAndPosition: [id, i],
            size: pinSize,
            x: x,
            y: pinSize + bodyHeight
          });
        })
      );
    }
  }, {
    key: 'renderBody',
    value: function renderBody() {
      var _props4 = this.props,
          theme = _props4.theme,
          text = _props4.text;


      var fontSize = theme.frame.font.size;

      var pinSize = theme.node.pin.size;

      var bodyHeight = this.getBodyHeight();

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
    key: 'renderDeleteButton',
    value: function renderDeleteButton() {
      var _props5 = this.props,
          multiSelection = _props5.multiSelection,
          selected = _props5.selected,
          theme = _props5.theme;


      var primaryColor = theme.frame.color.primary;

      var pinSize = theme.node.pin.size;

      if (selected === false || multiSelection) return null;

      return _react2.default.createElement(_CrossButton2.default, {
        action: this.deleteNode,
        color: primaryColor,
        size: pinSize,
        x: -(1.5 * pinSize),
        y: 0
      });
    }
  }, {
    key: 'renderInputMinus',
    value: function renderInputMinus() {
      var _props6 = this.props,
          ins = _props6.ins,
          multiSelection = _props6.multiSelection,
          selected = _props6.selected,
          theme = _props6.theme;


      var primaryColor = theme.frame.color.primary;

      var pinSize = theme.node.pin.size;

      if (!ins || selected === false || multiSelection) return null;

      var computedWidth = this.getComputedWidth();
      var disabled = ins.length === 0;

      return _react2.default.createElement(_MinusButton2.default, {
        action: this.deleteInputPin,
        color: primaryColor,
        disabled: disabled,
        size: pinSize,
        x: computedWidth + 2,
        y: 0
      });
    }
  }, {
    key: 'renderInputPlus',
    value: function renderInputPlus() {
      var _props7 = this.props,
          ins = _props7.ins,
          multiSelection = _props7.multiSelection,
          selected = _props7.selected,
          theme = _props7.theme;


      var primaryColor = theme.frame.color.primary;

      var pinSize = theme.node.pin.size;

      if (!ins || selected === false || multiSelection) return null;

      var computedWidth = this.getComputedWidth();

      return _react2.default.createElement(_PlusButton2.default, {
        action: this.createInputPin,
        color: primaryColor,
        size: pinSize,
        x: computedWidth + 4 + pinSize,
        y: 0
      });
    }
  }, {
    key: 'renderOutputMinus',
    value: function renderOutputMinus() {
      var _props8 = this.props,
          multiSelection = _props8.multiSelection,
          outs = _props8.outs,
          selected = _props8.selected,
          theme = _props8.theme;


      var primaryColor = theme.frame.color.primary;

      var pinSize = theme.node.pin.size;

      if (!outs || selected === false || multiSelection) return null;

      var bodyHeight = this.getBodyHeight();
      var computedWidth = this.getComputedWidth();
      var disabled = outs.length === 0;

      return _react2.default.createElement(_MinusButton2.default, {
        action: this.deleteOutputPin,
        color: primaryColor,
        disabled: disabled,
        size: pinSize,
        x: computedWidth + 2,
        y: bodyHeight + pinSize
      });
    }
  }, {
    key: 'renderOutputPlus',
    value: function renderOutputPlus() {
      var _props9 = this.props,
          multiSelection = _props9.multiSelection,
          outs = _props9.outs,
          selected = _props9.selected,
          theme = _props9.theme;


      var primaryColor = theme.frame.color.primary;

      var pinSize = theme.node.pin.size;

      if (!outs || selected === false || multiSelection) return null;

      var bodyHeight = this.getBodyHeight();
      var computedWidth = this.getComputedWidth();

      return _react2.default.createElement(_PlusButton2.default, {
        action: this.createOutputPin,
        color: primaryColor,
        size: pinSize,
        x: computedWidth + 4 + pinSize,
        y: bodyHeight + pinSize
      });
    }
  }]);

  return Node;
}(_react2.default.Component);

Node.defaultProps = {
  connectLinkToTarget: Function.prototype,
  createInputPin: Function.prototype,
  createLink: Function.prototype,
  createOutputPin: Function.prototype,
  deleteNode: Function.prototype,
  deleteOutputPin: Function.prototype,
  dragging: false,
  draggedLinkId: null,
  multiSelection: false,
  selected: false,
  selectNode: Function.prototype,
  text: 'Node',
  theme: _theme.defaultTheme
};
exports.default = Node;