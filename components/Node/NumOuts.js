(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', 'react', '../../utils/focusTarget'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('react'), require('../../utils/focusTarget'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.react, global.focusTarget);
    global.NumOuts = mod.exports;
  }
})(this, function (module, exports, _react, _focusTarget) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  var _focusTarget2 = _interopRequireDefault(_focusTarget);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var NumOuts = function NumOuts(_ref) {
    var setNum = _ref.setNum;
    var value = _ref.value;
    return _react2.default.createElement(
      'foreignObject',
      {
        x: -50,
        y: 20,
        width: 40,
        height: 20
      },
      _react2.default.createElement('input', {
        type: 'number',
        min: 0,
        step: 1,
        value: value,
        style: {
          width: 40
        },
        onClick: _focusTarget2.default,
        onChange: setNum
      })
    );
  };

  NumOuts.PropTypes = {
    value: _react.PropTypes.number.isRequired,
    onChange: _react.PropTypes.func.isRequired,
    onClick: _react.PropTypes.func.isRequired
  };

  exports.default = NumOuts;
  module.exports = exports['default'];
});