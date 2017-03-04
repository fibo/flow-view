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
})(this, function (module, exports, React) {
  'use strict';

  var PropTypes = React.PropTypes;

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
    darkPrimaryColor: '#AFB42B',
    primaryColor: '#CDDC39',
    lineWidth: 3,
    nodeBarColor: '#BDBDBD',
    nodeBodyHeight: 20,
    pinColor: '#757575',
    linkColor: '#9E9E9E',
    pinSize: 10
  };

  var propTypes = PropTypes.shape({
    fontFamily: PropTypes.string.isRequired,
    primaryColor: PropTypes.string.isRequired,
    lineWidth: PropTypes.number.isRequired,
    linkColor: PropTypes.string.isRequired,
    nodeBarColor: PropTypes.string.isRequired,
    nodeBodyHeight: PropTypes.number.isRequired,
    pinColor: PropTypes.string.isRequired,
    pinSize: PropTypes.number.isRequired
  }).isRequired;

  module.exports = exports.default = {
    defaultProps: defaultProps,
    propTypes: propTypes
  };
});