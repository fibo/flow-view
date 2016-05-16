'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _enumerableProps = require('./enumerableProps');

var _enumerableProps2 = _interopRequireDefault(_enumerableProps);

var _state = require('../default/state');

var _state2 = _interopRequireDefault(_state);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FlowViewCanvas = function FlowViewCanvas() {
  var data = arguments.length <= 0 || arguments[0] === undefined ? _state2.default : arguments[0];

  _classCallCheck(this, FlowViewCanvas);

  (0, _enumerableProps2.default)(this, data);
};

exports.default = FlowViewCanvas;