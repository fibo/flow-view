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
    global.Inspector = mod.exports;
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

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  var Inspector = function (_Component) {
    _inherits(Inspector, _Component);

    function Inspector() {
      _classCallCheck(this, Inspector);

      return _possibleConstructorReturn(this, (Inspector.__proto__ || Object.getPrototypeOf(Inspector)).apply(this, arguments));
    }

    _createClass(Inspector, [{
      key: 'render',
      value: function render() {
        var _props = this.props;
        var height = _props.height;
        var width = _props.width;
        var x = _props.x;
        var y = _props.y;


        return _react2.default.createElement(
          'foreignObject',
          {
            height: height,
            width: width,
            x: x,
            y: y
          },
          _react2.default.createElement(
            'p',
            null,
            'Halo inspektor'
          )
        );
      }
    }]);

    return Inspector;
  }(_react.Component);

  Inspector.propTypes = {
    height: _react.PropTypes.number.isRequired,
    width: _react.PropTypes.number.isRequired,
    x: _react.PropTypes.number.isRequired,
    y: _react.PropTypes.number.isRequired
  };

  Inspector.defaultProps = {
    width: 200,
    x: 0,
    y: 0
  };

  exports.default = Inspector;
  module.exports = exports['default'];
});