'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RectangularSelection = function (_React$Component) {
  _inherits(RectangularSelection, _React$Component);

  function RectangularSelection() {
    _classCallCheck(this, RectangularSelection);

    return _possibleConstructorReturn(this, (RectangularSelection.__proto__ || Object.getPrototypeOf(RectangularSelection)).apply(this, arguments));
  }

  _createClass(RectangularSelection, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          color = _props.color,
          height = _props.height,
          x = _props.x,
          y = _props.y,
          width = _props.width;


      var scaleX = width > 0 ? 1 : -1;
      var scaleY = height > 0 ? 1 : -1;

      return _react2.default.createElement('rect', {
        transform: 'translate(' + x + ' ' + y + ') scale(' + scaleX + ' ' + scaleY + ')',
        height: Math.abs(height),
        style: {
          fill: 'transparent',
          stroke: color,
          strokeDasharray: '10 10',
          strokeWidth: 2
        },
        width: Math.abs(width)
      });
    }
  }]);

  return RectangularSelection;
}(_react2.default.Component);

exports.default = RectangularSelection;