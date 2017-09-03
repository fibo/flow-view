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

var NodeButton = function (_React$PureComponent) {
  _inherits(NodeButton, _React$PureComponent);

  function NodeButton() {
    var _this;

    _classCallCheck(this, NodeButton);

    (0, _bindme2.default)((_this = _possibleConstructorReturn(this, (NodeButton.__proto__ || Object.getPrototypeOf(NodeButton)).call(this)), _this), 'onMouseDown', 'onMouseEnter', 'onMouseLeave');

    _this.state = { focus: false };
    return _this;
  }

  _createClass(NodeButton, [{
    key: 'onMouseEnter',
    value: function onMouseEnter() {
      this.setState({ focus: true });
    }
  }, {
    key: 'onMouseLeave',
    value: function onMouseLeave() {
      this.setState({ focus: false });
    }
  }, {
    key: 'onMouseDown',
    value: function onMouseDown() {
      var _props = this.props,
          action = _props.action,
          disabled = _props.disabled;


      if (!disabled) action();
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          color = _props2.color,
          disabled = _props2.disabled,
          size = _props2.size,
          x = _props2.x,
          y = _props2.y;
      var focus = this.state.focus;


      return _react2.default.createElement(
        'g',
        {
          onMouseDown: this.onMouseDown,
          onMouseEnter: this.onMouseEnter,
          onMouseLeave: this.onMouseLeave
        },
        _react2.default.createElement('path', {
          d: this.shape(size),
          fill: disabled ? 'transparent' : color,
          onMouseDown: this.onMouseDown,
          stroke: color,
          transform: 'translate(' + x + ',' + y + ')'
        }),
        _react2.default.createElement('circle', {
          cx: x + size / 2,
          cy: y + size / 2,
          fill: 'transparent',
          stroke: focus && !disabled ? color : 'transparent',
          r: this.ray()
        })
      );
    }
  }]);

  return NodeButton;
}(_react2.default.PureComponent);

NodeButton.defaultProps = {
  disabled: false
};
exports.default = NodeButton;