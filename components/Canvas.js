(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', 'react', 'react-dom', './Inspector', './Node', './Selector'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('react'), require('react-dom'), require('./Inspector'), require('./Node'), require('./Selector'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.react, global.reactDom, global.Inspector, global.Node, global.Selector);
    global.Canvas = mod.exports;
  }
})(this, function (module, exports, _react, _reactDom, _Inspector, _Node, _Selector) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  var _Inspector2 = _interopRequireDefault(_Inspector);

  var _Node2 = _interopRequireDefault(_Node);

  var _Selector2 = _interopRequireDefault(_Selector);

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

  var Canvas = function (_Component) {
    _inherits(Canvas, _Component);

    function Canvas() {
      _classCallCheck(this, Canvas);

      var _this = _possibleConstructorReturn(this, (Canvas.__proto__ || Object.getPrototypeOf(Canvas)).call(this));

      _this.state = {
        pointer: { x: 0, y: 0 },
        showSelector: false
      };
      return _this;
    }

    _createClass(Canvas, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        var container = (0, _reactDom.findDOMNode)(this).parentNode;

        var offset = {
          x: container.offsetLeft,
          y: container.offsetTop
        };

        this.setState({ offset: offset });
      }
    }, {
      key: 'render',
      value: function render() {
        var _props = this.props;
        var fontFamily = _props.fontFamily;
        var fontSize = _props.fontSize;
        var height = _props.height;
        var style = _props.style;
        var view = _props.view;
        var width = _props.width;
        var _state = this.state;
        var offset = _state.offset;
        var pointer = _state.pointer;
        var showSelector = _state.showSelector;


        var setState = this.setState.bind(this);

        var getCoordinates = function getCoordinates(e) {
          return {
            x: e.clientX - offset.x,
            y: e.clientY - offset.y
          };
        };

        var addNode = function addNode(_ref) {
          var x = _ref.x;
          var y = _ref.y;
          var text = _ref.text;

          console.log(text, x, y);
        };

        var onClick = function onClick(e) {
          e.preventDefault();
          e.stopPropagation();

          setState({
            showSelector: false
          });
        };

        var onDoubleClick = function onDoubleClick(e) {
          e.preventDefault();
          e.stopPropagation();

          setState({
            pointer: getCoordinates(e),
            showSelector: true
          });
        };

        return _react2.default.createElement(
          'svg',
          {
            fontFamily: fontFamily,
            fontSize: fontSize,
            height: height,
            onClick: onClick,
            onDoubleClick: onDoubleClick,
            textAnchor: 'start',
            style: style,
            width: width
          },
          _react2.default.createElement(_Inspector2.default, {
            height: height
          }),
          Object.keys(view.node).map(function (id) {
            return view.node[id].map(function (_ref2) {
              var height = _ref2.height;
              var ins = _ref2.ins;
              var outs = _ref2.outs;
              var text = _ref2.text;
              var width = _ref2.width;
              var x = _ref2.x;
              var y = _ref2.y;
              return _react2.default.createElement(_Node2.default, {
                height: height,
                ins: ins,
                outs: outs,
                text: text,
                width: width,
                x: x,
                y: y
              });
            });
          }),
          _react2.default.createElement(_Selector2.default, {
            addNode: addNode,
            show: showSelector,
            x: pointer.x,
            y: pointer.y
          })
        );
      }
    }]);

    return Canvas;
  }(_react.Component);

  Canvas.propTypes = {
    fontFamily: _react.PropTypes.string.isRequired,
    fontSize: _react.PropTypes.number.isRequired,
    height: _react.PropTypes.number.isRequired,
    style: _react.PropTypes.object.isRequired,
    view: _react.PropTypes.shape({
      link: _react.PropTypes.object.isRequired,
      node: _react.PropTypes.object.isRequired
    }),
    width: _react.PropTypes.number.isRequired
  };

  Canvas.defaultProps = {
    fontFamily: 'Courier',
    fontSize: 17,
    height: 400,
    style: { border: '1px solid black' },
    view: {
      link: {},
      node: {}
    },
    width: 400
  };

  exports.default = Canvas;
  module.exports = exports['default'];
});