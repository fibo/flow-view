(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', 'React'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('React'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.React);
    global.theme = mod.exports;
  }
})(this, function (module, exports, _React) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var defaultProps = {
    fontFamily: 'Courier',
    frameBorder: '1px solid black',
    highlightColor: 'lightsteelblue',
    lineWidth: 3,
    nodeBarColor: 'lightgray',
    nodeBodyHeight: 20,
    pinColor: 'darkgray', // Ahahah darkgray is not darker than gray!
    // Actually we have
    // lightgray < darkgray < gray
    pinSize: 10
  };

  var propTypes = _React.PropTypes.shape({
    fontFamily: _React.PropTypes.string.isRequired,
    highlightColor: _React.PropTypes.string.isRequired,
    lineWidth: _React.PropTypes.number.isRequired,
    nodeBarColor: _React.PropTypes.string.isRequired,
    nodeBodyHeight: _React.PropTypes.number.isRequired,
    pinColor: _React.PropTypes.string.isRequired,
    pinSize: _React.PropTypes.number.isRequired
  }).isRequired;

  exports.default = {
    defaultProps: defaultProps,
    propTypes: propTypes
  };
  module.exports = exports['default'];
});