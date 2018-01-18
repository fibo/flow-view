'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _server = require('react-dom/server');

var _server2 = _interopRequireDefault(_server);

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _bindme = require('bindme');

var _bindme2 = _interopRequireDefault(_bindme);

var _mergeOptions = require('merge-options');

var _mergeOptions2 = _interopRequireDefault(_mergeOptions);

var _svgx = require('svgx');

var _svgx2 = _interopRequireDefault(_svgx);

var _Frame = require('./components/Frame');

var _Frame2 = _interopRequireDefault(_Frame);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var defaultView = _Frame2.default.defaultProps.view;
var defaultOpt = {
  getTypeOfNode: _Frame2.default.defaultProps.getTypeOfNode,
  nodeComponent: _Frame2.default.defaultProps.nodeComponent,
  nodeList: _Frame2.default.defaultProps.nodeList,
  theme: _Frame2.default.defaultProps.theme
};

var FlowViewCanvas = function (_EventEmitter) {
  _inherits(FlowViewCanvas, _EventEmitter);

  function FlowViewCanvas(opt) {
    var _this;

    _classCallCheck(this, FlowViewCanvas);

    (0, _bindme2.default)((_this = _possibleConstructorReturn(this, (FlowViewCanvas.__proto__ || Object.getPrototypeOf(FlowViewCanvas)).call(this)), _this), 'emit');

    _this.opt = (0, _mergeOptions2.default)(opt, defaultOpt);
    return _this;
  }

  _createClass(FlowViewCanvas, [{
    key: 'load',
    value: function load() {
      var view = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultView;

      this.view = view;

      return this;
    }
  }, {
    key: 'mountOn',
    value: function mountOn(container) {
      var _this2 = this;

      var opt = this.opt,
          view = this.view;


      var rect = container.getBoundingClientRect();

      var width = rect.width,
          height = rect.height;

      _reactDom2.default.unmountComponentAtNode(container);

      _reactDom2.default.render(_react2.default.createElement(_Frame2.default, {
        emit: this.emit,
        height: height,
        opt: opt,
        ref: function ref(frame) {
          _this2.frame = frame;
        },
        theme: opt.theme,
        view: view,
        width: width
      }), container);
    }
  }, {
    key: 'resize',
    value: function resize(_ref) {
      var width = _ref.width,
          height = _ref.height;

      this.frame.setState({ width: width, height: height });
    }
  }, {
    key: 'toSVG',
    value: function toSVG(_ref2, callback) {
      var width = _ref2.width,
          height = _ref2.height;
      var opt = this.opt,
          view = this.view;
      var theme = opt.theme;


      var svgxOpts = { doctype: true, xmlns: true };

      var jsx = _react2.default.createElement(_Frame2.default, {
        height: height,
        opt: opt,
        theme: theme,
        view: view,
        width: width
      });

      var SVG = (0, _svgx2.default)(_server2.default.renderToStaticMarkup)(jsx, svgxOpts);

      callback(null, SVG);
    }
  }]);

  return FlowViewCanvas;
}(_events2.default);

exports.default = FlowViewCanvas;