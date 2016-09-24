(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', 'react', 'react-dom', './components/Canvas', 'events', 'not-defined', './utils/randomString', 'svgx'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('react'), require('react-dom'), require('./components/Canvas'), require('events'), require('not-defined'), require('./utils/randomString'), require('svgx'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.react, global.reactDom, global.Canvas, global.events, global.notDefined, global.randomString, global.svgx);
    global.Canvas = mod.exports;
  }
})(this, function (module, exports, _react, _reactDom, _Canvas, _events, _notDefined, _randomString, _svgx) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  var _Canvas2 = _interopRequireDefault(_Canvas);

  var _events2 = _interopRequireDefault(_events);

  var _notDefined2 = _interopRequireDefault(_notDefined);

  var _randomString2 = _interopRequireDefault(_randomString);

  var _svgx2 = _interopRequireDefault(_svgx);

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

  // TODO find a better way to generate ids.
  var idLength = 3;

  var FlowViewCanvas = function (_EventEmitter) {
    _inherits(FlowViewCanvas, _EventEmitter);

    function FlowViewCanvas(containerId, item) {
      _classCallCheck(this, FlowViewCanvas);

      var _this = _possibleConstructorReturn(this, (FlowViewCanvas.__proto__ || Object.getPrototypeOf(FlowViewCanvas)).call(this));

      _this.container = null;

      // Check that containerId is a string.
      if (typeof containerId !== 'string') {
        throw new TypeError('containerId must be a string', containerId);
      }

      // If we are in browser context, get the document element containing
      // the canvas or create it.
      if (typeof document !== 'undefined') {
        var container = document.getElementById(containerId);

        if (container === null) {
          container = document.createElement('div');
          container.id = containerId;
          document.body.appendChild(container);
        }

        _this.container = container;

        _this.item = item;
      }
      return _this;
    }

    /**
     * Render to SVG.
     *
     * @param {Object} view
     * @param {Function} [callback] run server side
     */


    _createClass(FlowViewCanvas, [{
      key: 'render',
      value: function render(view, callback) {
        var _this2 = this;

        view = Object.assign({}, {
          height: 400,
          link: {},
          node: {},
          width: 400
        }, view);

        var container = this.container;
        var item = this.item;

        var addInputPin = function addInputPin(nodeId, pin) {
          var ins = view.node[nodeId].ins;

          if ((0, _notDefined2.default)(ins)) view.node[nodeId].ins = ins = [];

          var position = ins.length;

          if ((0, _notDefined2.default)(pin)) pin = 'in' + position;

          view.node[nodeId].ins.push(pin);
        };

        var addOutputPin = function addOutputPin(nodeId, pin) {
          var outs = view.node[nodeId].outs;

          if ((0, _notDefined2.default)(outs)) view.node[nodeId].outs = outs = [];

          var position = outs.length;

          if ((0, _notDefined2.default)(pin)) pin = 'out' + position;

          view.node[nodeId].outs.push(pin);
        };

        var createLink = function createLink(link) {
          function generateId() {
            var id = (0, _randomString2.default)(idLength);
            return link[id] ? generateId() : id;
          }

          var id = generateId();

          view.link[id] = link;

          _this2.emit('createLink', link, id);

          return id;
        };

        var createNode = function createNode(node) {
          function generateId() {
            var id = (0, _randomString2.default)(idLength);
            return node[id] ? generateId() : id;
          }

          var id = generateId();

          view.node[id] = node;

          _this2.emit('createNode', node, id);

          return id;
        };

        var deleteLink = function deleteLink(id) {
          delete view.link[id];

          _this2.emit('deleteLink', id);
        };

        var deleteNode = function deleteNode(id) {
          // Remove links connected to given node.
          Object.keys(view.link).forEach(function (linkId) {
            var from = view.link[linkId].from;
            var to = view.link[linkId].to;

            if (from && from[0] === id) {
              delete view.link[linkId];

              _this2.emit('deleteLink', linkId);
            }

            if (to && to[0] === id) {
              delete view.link[linkId];

              _this2.emit('deleteLink', linkId);
            }
          });

          delete view.node[id];

          _this2.emit('deleteNode', id);
        };

        var dragItems = function dragItems(dragginDelta, draggedItems) {
          Object.keys(view.node).filter(function (id) {
            return draggedItems.indexOf(id) > -1;
          }).forEach(function (id) {
            view.node[id].x += dragginDelta.x;
            view.node[id].y += dragginDelta.y;
          });
        };

        var removeInputPin = function removeInputPin(nodeId, position) {
          var ins = view.node[nodeId].ins;

          if ((0, _notDefined2.default)(ins)) view.node[nodeId].ins = ins = [];

          if ((0, _notDefined2.default)(position)) position = ins.length - 1;

          view.node[nodeId].ins.splice(position, 1);
        };

        var removeOutputPin = function removeOutputPin(nodeId, position) {
          var outs = view.node[nodeId].outs;

          if ((0, _notDefined2.default)(outs)) view.node[nodeId].outs = outs = [];

          if ((0, _notDefined2.default)(position)) position = outs.length - 1;

          view.node[nodeId].outs.splice(position, 1);
        };

        var updateLink = function updateLink(id, link) {
          view.link[id] = Object.assign(view.link[id], link);
        };

        var component = _react2.default.createElement(_Canvas2.default, {
          addInputPin: addInputPin,
          addOutputPin: addOutputPin,
          createLink: createLink,
          createNode: createNode,
          deleteLink: deleteLink,
          deleteNode: deleteNode,
          dragItems: dragItems,
          item: item,
          removeInputPin: removeInputPin,
          removeOutputPin: removeOutputPin,
          updateLink: updateLink,
          view: view
        });

        if (container) {
          // Client side rendering.
          (0, _reactDom.render)(component, container);
        } else {
          // Server side rendering.

          var opts = { doctype: true, xmlns: true };
          var jsx = _react2.default.createElement(_Canvas2.default, {
            item: item,
            view: view
          });

          var outputSVG = (0, _svgx2.default)(jsx, opts);

          if (typeof callback === 'function') {
            callback(null, outputSVG);
          }
        }
      }
    }]);

    return FlowViewCanvas;
  }(_events2.default);

  exports.default = FlowViewCanvas;
  module.exports = exports['default'];
});