(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', 'react', 'react-dom', './components/Canvas', './utils/randomString', 'svgx'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('react'), require('react-dom'), require('./components/Canvas'), require('./utils/randomString'), require('svgx'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.react, global.reactDom, global.Canvas, global.randomString, global.svgx);
    global.Canvas = mod.exports;
  }
})(this, function (module, exports, _react, _reactDom, _Canvas, _randomString, _svgx) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  var _Canvas2 = _interopRequireDefault(_Canvas);

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

  // TODO find a better way to generate ids.
  var idLength = 3;

  var FlowViewCanvas = function () {
    function FlowViewCanvas(containerId, item) {
      _classCallCheck(this, FlowViewCanvas);

      this.container = null;

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

        this.container = container;

        this.item = item;
      }
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
        var container = this.container;
        var item = this.item;

        var createLink = function createLink(link) {
          function generateId() {
            var id = (0, _randomString2.default)(idLength);
            return link[id] ? generateId() : id;
          }

          var id = generateId();

          view.link[id] = link;

          return id;
        };

        var createNode = function createNode(node) {
          function generateId() {
            var id = (0, _randomString2.default)(idLength);
            return node[id] ? generateId() : id;
          }

          var id = generateId();

          view.node[id] = node;
        };

        var deleteLink = function deleteLink(id) {
          delete view.link[id];
        };

        var dragItems = function dragItems(dragginDelta, draggedItems) {
          Object.keys(view.node).filter(function (id) {
            return draggedItems.indexOf(id) > -1;
          }).forEach(function (id) {
            view.node[id].x += dragginDelta.x;
            view.node[id].y += dragginDelta.y;
          });
        };

        var updateLink = function updateLink(id, link) {
          view.link[id] = Object.assign(view.link[id], link);
        };

        var component = _react2.default.createElement(_Canvas2.default, {
          createLink: createLink,
          createNode: createNode,
          deleteLink: deleteLink,
          dragItems: dragItems,
          item: item,
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
  }();

  exports.default = FlowViewCanvas;
  module.exports = exports['default'];
});