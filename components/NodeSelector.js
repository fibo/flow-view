(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', 'react', '../util/ignoreEvent'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('react'), require('../util/ignoreEvent'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.react, global.ignoreEvent);
    global.NodeSelector = mod.exports;
  }
})(this, function (module, exports, _react, _ignoreEvent) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  var _ignoreEvent2 = _interopRequireDefault(_ignoreEvent);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var NodeSelector = function NodeSelector(_ref) {
    var x = _ref.x;
    var y = _ref.y;
    var text = _ref.text;
    var show = _ref.show;
    var addNode = _ref.addNode;
    var changeText = _ref.changeText;
    return show ? _react2.default.createElement(
      'foreignObject',
      {
        x: x,
        y: y,
        width: 120,
        height: 20,
        onClick: _ignoreEvent2.default
      },
      _react2.default.createElement('input', {
        type: 'text',
        value: text,
        onChange: changeText,
        onKeyPress: function onKeyPress(e) {
          if (e.key === 'Enter') {
            addNode({ x: x, y: y, text: e.target.value });
          }
        },
        ref: function ref(input) {
          if (input !== null) input.focus();
        }
      })
    ) : null;
  };

  NodeSelector.propTypes = {
    x: _react.PropTypes.number,
    y: _react.PropTypes.number
  };

  exports.default = NodeSelector;
  module.exports = exports['default'];
});