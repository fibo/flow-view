'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _staticProps = require('static-props');

var _staticProps2 = _interopRequireDefault(_staticProps);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var nextId = 0;

var generateId = function generateId() {
  nextId++;
  return 'id' + nextId;
};

var FlowViewItem = function () {
  function FlowViewItem() {
    var id = arguments.length <= 0 || arguments[0] === undefined ? generateId() : arguments[0];

    _classCallCheck(this, FlowViewItem);

    (0, _staticProps2.default)(this)({ id: id });
  }

  _createClass(FlowViewItem, [{
    key: 'getData',
    value: function getData() {
      var enumerableProps = Object.keys(this);

      var data = {};

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = enumerableProps[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var prop = _step.value;

          data[prop] = this[prop];
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return data;
    }
  }]);

  return FlowViewItem;
}();

exports.default = FlowViewItem;