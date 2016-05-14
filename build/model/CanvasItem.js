'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _staticProps = require('static-props');

var _staticProps2 = _interopRequireDefault(_staticProps);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FlowViewCanvasItem = function FlowViewCanvasItem(canvas) {
  _classCallCheck(this, FlowViewCanvasItem);

  (0, _staticProps2.default)(this)({ canvas: canvas });
};

exports.default = FlowViewCanvasItem;