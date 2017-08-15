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

var PlusButton = function (_NodeButton) {
  _inherits(PlusButton, _NodeButton);

  function PlusButton() {
    _classCallCheck(this, PlusButton);

    return _possibleConstructorReturn(this, (PlusButton.__proto__ || Object.getPrototypeOf(PlusButton)).apply(this, arguments));
  }

  _createClass(PlusButton, [{
    key: 'ray',
    value: function ray() {
      return 1 + this.props.size / 2;
    }
  }, {
    key: 'shape',
    value: function shape(size) {
      var u = size / 6;
      var hs = Math.sqrt(2) * u / 2;

      return 'M 0 ' + (3 * u - hs) + ' V ' + (3 * u + hs) + ' H ' + (3 * u - hs) + ' V ' + size + ' H ' + (3 * u + hs) + ' V ' + (3 * u + hs) + ' H ' + size + ' V ' + (3 * u - hs) + ' H ' + (3 * u + hs) + ' V 0 H ' + (3 * u - hs) + ' V ' + (3 * u - hs) + ' Z';
    }
  }]);

  return PlusButton;
}(_NodeButton3.default);

exports.default = PlusButton;