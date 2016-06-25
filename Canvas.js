(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', 'react', 'react-dom', 'redux', 'react-redux', './containers/App', './util/initialState', './reducers', 'static-props'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('react'), require('react-dom'), require('redux'), require('react-redux'), require('./containers/App'), require('./util/initialState'), require('./reducers'), require('static-props'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.react, global.reactDom, global.redux, global.reactRedux, global.App, global.initialState, global.reducers, global.staticProps);
    global.Canvas = mod.exports;
  }
})(this, function (module, exports, _react, _reactDom, _redux, _reactRedux, _App, _initialState, _reducers, _staticProps) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  var _App2 = _interopRequireDefault(_App);

  var _initialState2 = _interopRequireDefault(_initialState);

  var _reducers2 = _interopRequireDefault(_reducers);

  var _staticProps2 = _interopRequireDefault(_staticProps);

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

  var Canvas = function () {
    function Canvas(containerId) {
      _classCallCheck(this, Canvas);

      var container = null;

      // Check that containerId is a string.
      if (typeof containerId !== 'string') {
        throw new TypeError('containerId must be a string', containerId);
      }

      // If we are in browser context, get the container or create it.
      if (typeof document !== 'undefined') {
        container = document.getElementById(containerId);

        if (container === null) {
          container = document.createElement('div');
          container.id = containerId;
          document.body.appendChild(container);
        }
      }

      (0, _staticProps2.default)(this)({ container: container, containerId: containerId });
    }

    _createClass(Canvas, [{
      key: 'render',
      value: function render(view) {
        var container = this.container;

        var store = (0, _redux.createStore)(_reducers2.default, Object.assign(_initialState2.default, view), window.devToolsExtension && window.devToolsExtension());

        (0, _reactDom.render)(_react2.default.createElement(
          _reactRedux.Provider,
          { store: store },
          _react2.default.createElement(_App2.default, { container: container })
        ), container);
      }
    }]);

    return Canvas;
  }();

  exports.default = Canvas;
  module.exports = exports['default'];
});