(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', 'react', 'react-dom', './components/Canvas'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('react'), require('react-dom'), require('./components/Canvas'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.react, global.reactDom, global.Canvas);
    global.Canvas = mod.exports;
  }
})(this, function (module, exports, _react, _reactDom, _Canvas) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  var _Canvas2 = _interopRequireDefault(_Canvas);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var FlowViewCanvas = function () {
    function FlowViewCanvas(containerId) {
      _classCallCheck(this, FlowViewCanvas);

      this.container = null;

      // Check that containerId is a string.
      if (typeof containerId !== 'string') {
        throw new TypeError('containerId must be a string', containerId);
      }

      // If we are in browser context, get the document element containing
      // the canvas or create it.
      if (typeof document !== 'undefined') {
        var container = document.getElementById(containerId);

        if (container === null) {
          container = document.createElement('div');
          container.id = containerId;
          document.body.appendChild(container);
        }

        this.container = container;
      }
    }

    _createClass(FlowViewCanvas, [{
      key: 'render',
      value: function render(view) {
        var container = this.container;

        (0, _reactDom.render)(_react2.default.createElement(_Canvas2.default, { view: view }), container);
      }
    }]);

    return FlowViewCanvas;
  }();

  exports.default = FlowViewCanvas;
  module.exports = exports['default'];
});