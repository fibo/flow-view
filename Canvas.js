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

var _notDefined = require('not-defined');

var _notDefined2 = _interopRequireDefault(_notDefined);

var _svgx = require('svgx');

var _svgx2 = _interopRequireDefault(_svgx);

var _Frame = require('./components/Frame');

var _Frame2 = _interopRequireDefault(_Frame);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var defaultOpt = _Frame2.default.defaultProps.opt;

var FlowViewCanvas = function (_EventEmitter) {
  _inherits(FlowViewCanvas, _EventEmitter);

  function FlowViewCanvas(container, opt) {
    var _this;

    _classCallCheck(this, FlowViewCanvas);

    (0, _bindme2.default)((_this = _possibleConstructorReturn(this, (FlowViewCanvas.__proto__ || Object.getPrototypeOf(FlowViewCanvas)).call(this)), _this), 'emitCreateInputPin', 'emitCreateLink', 'emitCreateNode', 'emitCreateOutputPin', 'emitDeleteInputPin', 'emitDeleteOutputPin', 'emitDeleteLink', 'emitDeleteNode', 'emitDeleteOutputPin', 'emitUpdateNodesGeometry');

    _this.view = _Frame2.default.defaultProps.view;

    if ((0, _notDefined2.default)(opt)) opt = defaultOpt;
    if ((0, _notDefined2.default)(opt.node)) opt.node = defaultOpt.node;
    if ((0, _notDefined2.default)(opt.node.DefaultNode)) opt.node.DefaultNode = defaultOpt.node.DefaultNode;
    if ((0, _notDefined2.default)(opt.nodeList)) opt.nodeList = defaultOpt.nodeList;
    if ((0, _notDefined2.default)(opt.util)) opt.util = defaultOpt.util;

    _this.opt = opt;

    var containerElement = void 0;
    var containerNotFound = false;

    if (typeof document !== 'undefined') {
      if (typeof container === 'string') {
        containerElement = document.getElementById(container);

        if (document.body && document.body.contains(containerElement)) {
          _this.container = containerElement;
        } else {
          containerNotFound = true;
        }
      } else {
        if (container && document.body && document.body.contains(container)) {
          _this.container = container;
        } else {
          containerNotFound = true;
        }
      }

      if (containerNotFound) {
        throw new TypeError('container must be a String or an HTMLElement');
      }
    } else {
      _this.container = null;
    }
    return _this;
  }

  _createClass(FlowViewCanvas, [{
    key: 'emitCreateInputPin',
    value: function emitCreateInputPin(nodeIdAndPosition, pin) {
      this.emit('createInputPin', nodeIdAndPosition, pin);
    }
  }, {
    key: 'emitCreateLink',
    value: function emitCreateLink(link, id) {
      this.emit('createLink', link, id);
    }
  }, {
    key: 'emitCreateNode',
    value: function emitCreateNode(node, id) {
      this.emit('createNode', node, id);
    }
  }, {
    key: 'emitCreateOutputPin',
    value: function emitCreateOutputPin(nodeIdAndPosition, pin) {
      this.emit('createOutputPin', nodeIdAndPosition, pin);
    }
  }, {
    key: 'emitDeleteInputPin',
    value: function emitDeleteInputPin(nodeIdAndPosition) {
      this.emit('deleteInputPin', nodeIdAndPosition);
    }
  }, {
    key: 'emitDeleteLink',
    value: function emitDeleteLink(id) {
      this.emit('deleteLink', id);
    }
  }, {
    key: 'emitDeleteNode',
    value: function emitDeleteNode(id) {
      this.emit('deleteNode', id);
    }
  }, {
    key: 'emitDeleteOutputPin',
    value: function emitDeleteOutputPin(nodeIdAndPosition) {
      this.emit('deleteOutputPin', nodeIdAndPosition);
    }
  }, {
    key: 'emitUpdateNodesGeometry',
    value: function emitUpdateNodesGeometry(nodes) {
      this.emit('updateNodesGeometry', nodes);
    }
  }, {
    key: 'getView',
    value: function getView() {
      return Object.assign({}, this.view);
    }
  }, {
    key: 'render',
    value: function render(view, model, callback) {
      var container = this.container;
      var opt = this.opt;

      var height = void 0;
      var width = void 0;

      if (container) {
        var border = 1;
        var rect = container.getBoundingClientRect();

        height = rect.height - 2 * border;
        width = rect.width - 2 * border;
      }

      if ((0, _notDefined2.default)(view)) view = {};
      if ((0, _notDefined2.default)(view.height)) view.height = height;
      if ((0, _notDefined2.default)(view.link)) view.link = {};
      if ((0, _notDefined2.default)(view.node)) view.node = {};
      if ((0, _notDefined2.default)(view.width)) view.width = width;

      if (container) {
        _reactDom2.default.unmountComponentAtNode(container);

        _reactDom2.default.render(_react2.default.createElement(_Frame2.default, {
          emitCreateInputPin: this.emitCreateInputPin,
          emitCreateLink: this.emitCreateLink,
          emitCreateNode: this.emitCreateNode,
          emitCreateOutputPin: this.emitCreateOutputPin,
          emitDeleteInputPin: this.emitDeleteInputPin,
          emitDeleteLink: this.emitDeleteLink,
          emitDeleteNode: this.emitDeleteNode,
          emitDeleteOutputPin: this.emitDeleteOutputPin,
          emitUpdateNodesGeometry: this.emitUpdateNodesGeometry,
          opt: opt,
          model: model,
          nodeList: opt.nodeList,
          view: view
        }), container);
      } else {

        var opts = { doctype: true, xmlns: true };

        var jsx = _react2.default.createElement(_Frame2.default, { responsive: true,
          opt: opt,
          view: view
        });

        var outputSVG = (0, _svgx2.default)(_server2.default.renderToStaticMarkup)(jsx, opts);

        if (typeof callback === 'function') {
          callback(null, outputSVG);
        }
      }
    }
  }]);

  return FlowViewCanvas;
}(_events2.default);

exports.default = FlowViewCanvas;