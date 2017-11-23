'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _bindme = require('bindme');

var _bindme2 = _interopRequireDefault(_bindme);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Selector = function (_React$Component) {
  _inherits(Selector, _React$Component);

  function Selector() {
    var _temp, _this;

    _classCallCheck(this, Selector);

    (0, _bindme2.default)((_temp = (_this = _possibleConstructorReturn(this, (Selector.__proto__ || Object.getPrototypeOf(Selector)).call(this)), _this), _this.state = { text: '' }, _temp), 'onChange', 'onClick', 'onDoubleClick', 'onKeyPress', 'onMouseDown', 'onMouseUp');
    return _this;
  }

  _createClass(Selector, [{
    key: 'inputStyle',
    value: function inputStyle() {
      var theme = this.props.theme;


      var border = theme.selector.border;
      var fontFamily = theme.frame.font.family;
      var fontSize = theme.frame.font.size;

      return {
        border: border.width + 'px ' + border.style + ' ' + border.color,
        fontFamily: fontFamily,
        fontSize: fontSize,
        outline: 'none',
        width: 200
      };
    }
  }, {
    key: 'onChange',
    value: function onChange(event) {
      this.setState({ text: event.target.value });
    }
  }, {
    key: 'onClick',
    value: function onClick(event) {
      event.stopPropagation();
    }
  }, {
    key: 'onDoubleClick',
    value: function onDoubleClick(event) {
      event.stopPropagation();
    }
  }, {
    key: 'onKeyPress',
    value: function onKeyPress(event) {
      var _props = this.props,
          createNode = _props.createNode,
          pointer = _props.pointer;


      var text = event.target.value.trim();

      var pressedEnter = event.key === 'Enter';
      var textIsNotBlank = text.length > 0;

      if (pressedEnter) {
        if (textIsNotBlank) {
          createNode({
            ins: [],
            outs: [],
            text: text,
            x: pointer.x,
            y: pointer.y
          });
        }

        this.setState({ text: '' });
      }
    }
  }, {
    key: 'onMouseDown',
    value: function onMouseDown(event) {
      event.stopPropagation();
    }
  }, {
    key: 'onMouseUp',
    value: function onMouseUp(event) {
      event.stopPropagation();
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          height = _props2.height,
          nodeList = _props2.nodeList,
          pointer = _props2.pointer,
          show = _props2.show,
          width = _props2.width;


      var text = this.state.text;

      var hidden = { display: 'none', overflow: 'hidden' };
      var visible = { display: 'inline', overflow: 'visible' };

      var inputStyle = this.inputStyle();

      return _react2.default.createElement(
        'foreignObject',
        {
          height: height,
          style: show ? visible : hidden,
          width: width,
          x: pointer ? pointer.x : 0,
          y: pointer ? pointer.y : 0
        },
        _react2.default.createElement('input', {
          list: 'nodes',
          type: 'text',
          ref: function ref(input) {
            if (input !== null) input.focus();
          },
          style: inputStyle,
          onChange: this.onChange,
          onClick: this.onClick,
          onDoubleClick: this.onDoubleClick,
          onKeyPress: this.onKeyPress,
          onMouseDown: this.onMouseDown,
          onMouseUp: this.onMouseUp,
          value: text
        }),
        nodeList ? _react2.default.createElement(
          'datalist',
          { id: 'nodes' },
          nodeList.map(function (item, i) {
            return _react2.default.createElement('option', { key: i, value: item });
          })
        ) : null
      );
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps) {
      return this.props.show || nextProps.show;
    }
  }]);

  return Selector;
}(_react2.default.Component);

Selector.defaultProps = {
  height: 20,
  width: 200
};
exports.default = Selector;