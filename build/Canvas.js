'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _redux = require('redux');

var _reactRedux = require('react-redux');

var _App = require('./containers/App');

var _App2 = _interopRequireDefault(_App);

var _initialState = require('./initialState');

var _initialState2 = _interopRequireDefault(_initialState);

var _reducers = require('./reducers');

var _reducers2 = _interopRequireDefault(_reducers);

var _staticProps = require('static-props');

var _staticProps2 = _interopRequireDefault(_staticProps);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Canvas = function () {
  function Canvas(elementId) {
    _classCallCheck(this, Canvas);

    if (typeof elementId !== 'string') {
      throw new TypeError('elementId must be a string', elementId);
    }

    // Create element and append it to body if it does not exist already.
    var element = document.getElementById(elementId);

    if (element === null) {
      element = document.createElement('div');
      element.id = elementId;
      document.body.appendChild(element);
    }

    (0, _staticProps2.default)(this)({
      element: element
    });
  }

  _createClass(Canvas, [{
    key: 'render',
    value: function render(view) {
      var element = this.element;

      var store = (0, _redux.createStore)(_reducers2.default, Object.assign(_initialState2.default, view), window.devToolsExtension && window.devToolsExtension());

      (0, _reactDom.render)(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(_App2.default, null)
      ), element);
    }
  }]);

  return Canvas;
}();

exports.default = Canvas;