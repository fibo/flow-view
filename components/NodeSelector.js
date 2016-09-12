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
    global.NodeSelector = mod.exports;
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

  var hidden = { display: 'none', overflow: 'hidden' };
  var visible = { display: 'inline', overflow: 'visible' };

  var NodeSelector = function NodeSelector(_ref) {
    var addNode = _ref.addNode;
    var show = _ref.show;
    var x = _ref.x;
    var y = _ref.y;
    return _react2.default.createElement(
      'foreignObject',
      {
        style: show ? visible : hidden,
        x: x,
        y: y,
        width: 200,
        height: 20
      },
      _react2.default.createElement('input', {
        type: 'text',
        ref: function ref(input) {
          if (input !== null) input.focus();
        },
        style: { outline: 'none' },
        onKeyPress: function onKeyPress(e) {
          var text = e.target.value.trim();

          var pressedEnter = e.key === 'Enter';
          var textIsNotBlank = text.length > 0;

          if (pressedEnter && textIsNotBlank) {
            addNode({ x: x, y: y, text: text });
          }
        }
      })
    );
  };

  NodeSelector.propTypes = {
    addNode: _react.PropTypes.func,
    show: _react.PropTypes.bool,
    x: _react.PropTypes.number,
    y: _react.PropTypes.number
  };

  exports.default = NodeSelector;
  module.exports = exports['default'];
});