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
    global.theme = mod.exports;
  }
})(this, function (module, exports, _react) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var defaultProps = {
    fontFamily: 'Courier',
    frameBorder: '1px solid black',
    highlightColor: 'lightsteelblue',
    lineWidth: 3,
    linkColor: 'gray',
    nodeBarColor: 'lightgray',
    nodeBodyHeight: 20,
    pinColor: 'darkgray', // Ahahah darkgray is not darker than gray!
    // Actually we have
    // lightgray < darkgray < gray
    pinSize: 10
  };

  var propTypes = _react.PropTypes.shape({
    fontFamily: _react.PropTypes.string.isRequired,
    highlightColor: _react.PropTypes.string.isRequired,
    lineWidth: _react.PropTypes.number.isRequired,
    linkColor: _react.PropTypes.string.isRequired,
    nodeBarColor: _react.PropTypes.string.isRequired,
    nodeBodyHeight: _react.PropTypes.number.isRequired,
    pinColor: _react.PropTypes.string.isRequired,
    pinSize: _react.PropTypes.number.isRequired
  }).isRequired;

  exports.default = {
    defaultProps: defaultProps,
    propTypes: propTypes
  };
  module.exports = exports['default'];
});