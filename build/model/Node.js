'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Item2 = require('./Item');

var _Item3 = _interopRequireDefault(_Item2);

var _enumerableProps = require('./enumerableProps');

var _enumerableProps2 = _interopRequireDefault(_enumerableProps);

var _validate = require('./validate');

var _validate2 = _interopRequireDefault(_validate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FlowViewNode = function (_Item) {
  _inherits(FlowViewNode, _Item);

  function FlowViewNode(data, id) {
    _classCallCheck(this, FlowViewNode);

    _validate2.default.Node(data);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(FlowViewNode).call(this, id));

    (0, _enumerableProps2.default)(_this, data);
    return _this;
  }

  _createClass(FlowViewNode, [{
    key: 'numIns',
    value: function numIns() {
      return this.data.ins.length;
    }
  }, {
    key: 'numOuts',
    value: function numOuts() {
      return this.data.outs.length;
    }
  }]);

  return FlowViewNode;
}(_Item3.default);

exports.default = FlowViewNode;