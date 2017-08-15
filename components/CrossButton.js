'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _NodeButton2 = require('./NodeButton');

var _NodeButton3 = _interopRequireDefault(_NodeButton2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CrossButton = function (_NodeButton) {
  _inherits(CrossButton, _NodeButton);

  function CrossButton() {
    _classCallCheck(this, CrossButton);

    return _possibleConstructorReturn(this, (CrossButton.__proto__ || Object.getPrototypeOf(CrossButton)).apply(this, arguments));
  }

  _createClass(CrossButton, [{
    key: 'ray',
    value: function ray() {
      return this.props.size * Math.sqrt(0.47);
    }
  }, {
    key: 'shape',
    value: function shape(size) {
      var u = size / 6;

      return 'M ' + 4 * u + ' ' + 3 * u + ' L ' + 6 * u + ' ' + u + ' L ' + 5 * u + ' 0 L ' + 3 * u + ' ' + 2 * u + ' L ' + u + ' 0 L 0 ' + u + ' L ' + 2 * u + ' ' + 3 * u + ' L 0 ' + 5 * u + ' L ' + u + ' ' + 6 * u + ' L ' + 3 * u + ' ' + 4 * u + ' L ' + 5 * u + ' ' + 6 * u + ' L ' + 6 * u + ' ' + 5 * u + ' Z';
    }
  }]);

  return CrossButton;
}(_NodeButton3.default);

exports.default = CrossButton;