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


  /*
  
  Palette from https://www.materialpalette.com/lime/grey
  
  Thanks to Tania and Lucilla.
  
  dark primary color #AFB42B
  primary color #CDDC39
  light primary color #F0F4C3
  
  accent color #9E9E9E
  primary text #212121
  secondary text #757575
  
  text / icons #212121
  divider color #BDBDBD
  */

  var defaultProps = {
    fontFamily: 'Courier',
    frameBorder: '1px solid #F0F4C3',
    highlightColor: '#CDDC39',
    lineWidth: 3,
    linkColor: '#757575',
    nodeBarColor: '#BDBDBD',
    nodeBodyHeight: 20,
    pinColor: '#9E9E9E',
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