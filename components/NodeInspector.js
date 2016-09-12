(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', 'react'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('react'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.react);
    global.NodeInspector = mod.exports;
  }
})(this, function (module, exports, _react) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var NodeInspector = function NodeInspector(_ref) {
    var x = _ref.x;
    var y = _ref.y;
    return _react2.default.createElement(
      'foreignObject',
      {
        x: x,
        y: y,
        width: 200,
        height: 20
      },
      _react2.default.createElement(
        'p',
        null,
        '\'Halo inspektor\''
      )
    );
  };

  NodeInspector.propTypes = {
    x: _react.PropTypes.number,
    y: _react.PropTypes.number
  };

  exports.default = NodeInspector;
  module.exports = exports['default'];
});