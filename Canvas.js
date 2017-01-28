(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', 'react', 'react-dom', './components/Frame', 'events', 'not-defined', './utils/randomString', 'svgx'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('react'), require('react-dom'), require('./components/Frame'), require('events'), require('not-defined'), require('./utils/randomString'), require('svgx'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.react, global.reactDom, global.Frame, global.events, global.notDefined, global.randomString, global.svgx);
    global.Canvas = mod.exports;
  }
})(this, function (module, exports, _react, _reactDom, _Frame, _events, _notDefined, _randomString, _svgx) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  var _Frame2 = _interopRequireDefault(_Frame);

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

  var Canvas = function (_EventEmitter) {
    _inherits(Canvas, _EventEmitter);

    function Canvas(containerId, item) {
      _classCallCheck(this, Canvas);

      var _this = _possibleConstructorReturn(this, (Canvas.__proto__ || Object.getPrototypeOf(Canvas)).call(this));

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

          container.setAttribute('style', 'display: inline-block; height: 400px; width: 100%;');

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
     * @param {Object} [model]
     * @param {Function} [callback] run server side
     */

    _createClass(Canvas, [{
      key: 'render',
      value: function render(view, model, callback) {
        var _this2 = this;

        var container = this.container;

        var defaultItem = _Frame2.default.defaultProps.item;

        var DefaultLink = defaultItem.link.DefaultLink;
        var DefaultNode = defaultItem.node.DefaultNode;
        var typeOfNode = defaultItem.util.typeOfNode;

        var item = Object.assign({}, { link: { DefaultLink: DefaultLink } }, { node: { DefaultNode: DefaultNode } }, { nodeList: [] }, { util: { typeOfNode: typeOfNode } }, this.item);

        var height = void 0;
        var width = void 0;

        // Get height and width from container, if any.
        if (container) {
          var border = 1; // TODO could be configurable in style prop
          var rect = container.getBoundingClientRect();

          height = rect.height - 2 * border;
          width = rect.width - 2 * border;
        }

        view = Object.assign({}, {
          height: height,
          link: {},
          node: {},
          width: width
        }, view);

        var createInputPin = function createInputPin(nodeId, pin) {
          var ins = view.node[nodeId].ins;

          if ((0, _notDefined2.default)(ins)) view.node[nodeId].ins = ins = [];

          var position = ins.length;

          if ((0, _notDefined2.default)(pin)) pin = 'in' + position;

          _this2.emit('createInputPin', nodeId, position, pin);

          view.node[nodeId].ins.push(pin);
        };

        var createOutputPin = function createOutputPin(nodeId, pin) {
          var outs = view.node[nodeId].outs;

          if ((0, _notDefined2.default)(outs)) view.node[nodeId].outs = outs = [];

          var position = outs.length;

          if ((0, _notDefined2.default)(pin)) pin = 'out' + position;

          _this2.emit('createOutputPin', nodeId, position, pin);

          view.node[nodeId].outs.push(pin);
        };

        function generateId() {
          var id = (0, _randomString2.default)(idLength);

          return view.link[id] || view.node[id] ? generateId() : id;
        }

        var createLink = function createLink(link) {
          var from = link.from;
          var to = link.to;

          var id = generateId();

          // Do not fire createLink event if it is a dragging link.
          if ((0, _notDefined2.default)(to)) {
            view.link[id] = { from: from };
          } else {
            view.link[id] = { from: from, to: to };

            _this2.emit('createLink', { from: from, to: to }, id);
          }

          return id;
        };

        var createNode = function createNode(node) {
          var id = generateId();

          view.node[id] = node;

          _this2.emit('createNode', node, id);

          return id;
        };

        var deleteLink = function deleteLink(id) {
          _this2.emit('deleteLink', id);

          delete view.link[id];
        };

        var deleteNode = function deleteNode(id) {
          // delete links connected to given node.
          Object.keys(view.link).forEach(function (linkId) {
            var from = view.link[linkId].from;
            var to = view.link[linkId].to;

            if (from && from[0] === id) {
              deleteLink(linkId);
            }

            if (to && to[0] === id) {
              deleteLink(linkId);
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

        var deleteInputPin = function deleteInputPin(nodeId, position) {
          var ins = view.node[nodeId].ins;

          if ((0, _notDefined2.default)(ins)) view.node[nodeId].ins = ins = [];

          if ((0, _notDefined2.default)(position)) position = ins.length - 1;

          _this2.emit('deleteInputPin', nodeId, position);

          view.node[nodeId].ins.splice(position, 1);
        };

        var deleteOutputPin = function deleteOutputPin(nodeId, position) {
          var outs = view.node[nodeId].outs;

          if ((0, _notDefined2.default)(outs)) view.node[nodeId].outs = outs = [];

          if ((0, _notDefined2.default)(position)) position = outs.length - 1;

          _this2.emit('deleteOutputPin', nodeId, position);

          view.node[nodeId].outs.splice(position, 1);
        };

        var renameNode = function renameNode(nodeId, text) {
          view.node[nodeId].text = text;
        };

        var updateLink = function updateLink(id, link) {
          var to = link.to;
          var from = link.from;

          // Trigger a createLink event if it is a connected link.
          if ((0, _notDefined2.default)(from)) {
            view.link[id].to = to;

            _this2.emit('createLink', view.link[id], id);
          }
        };

        var component = _react2.default.createElement(_Frame2.default, {
          createInputPin: createInputPin,
          createOutputPin: createOutputPin,
          createLink: createLink,
          createNode: createNode,
          deleteLink: deleteLink,
          deleteInputPin: deleteInputPin,
          deleteNode: deleteNode,
          deleteOutputPin: deleteOutputPin,
          dragItems: dragItems,
          item: item,
          model: model,
          nodeList: item.nodeList,
          renameNode: renameNode,
          updateLink: updateLink,
          view: view
        });

        if (container) {
          // Client side rendering.
          (0, _reactDom.render)(component, container);
        } else {
          // Server side rendering.

          var opts = { doctype: true, xmlns: true };
          var jsx = _react2.default.createElement(_Frame2.default, {
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

    return Canvas;
  }(_events2.default);

  exports.default = Canvas;
  module.exports = exports['default'];
});