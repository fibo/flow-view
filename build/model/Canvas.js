'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _enumerableProps = require('./enumerableProps');

var _enumerableProps2 = _interopRequireDefault(_enumerableProps);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FlowViewCanvas = function FlowViewCanvas() {
  var node = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var link = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  _classCallCheck(this, FlowViewCanvas);

  (0, _enumerableProps2.default)(this, {
    node: node, link: link
  });
};

exports.default = FlowViewCanvas;