(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', 'react', 'react-dom', 'redux', 'react-redux', './containers/FlowView', './util/emptyView', './reducers', 'static-props'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('react'), require('react-dom'), require('redux'), require('react-redux'), require('./containers/FlowView'), require('./util/emptyView'), require('./reducers'), require('static-props'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.react, global.reactDom, global.redux, global.reactRedux, global.FlowView, global.emptyView, global.reducers, global.staticProps);
    global.Canvas = mod.exports;
  }
})(this, function (module, exports, _react, _reactDom, _redux, _reactRedux, _FlowView, _emptyView, _reducers, _staticProps) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  var _FlowView2 = _interopRequireDefault(_FlowView);

  var _emptyView2 = _interopRequireDefault(_emptyView);

  var _reducers2 = _interopRequireDefault(_reducers);

  var _staticProps2 = _interopRequireDefault(_staticProps);

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

  var Canvas = function () {
    function Canvas(documentElementId) {
      _classCallCheck(this, Canvas);

      var documentElement = null;

      // Check that documentElementId is a string.
      if (typeof documentElementId !== 'string') {
        throw new TypeError('documentElementId must be a string', documentElementId);
      }

      // If we are in browser context, get the documentElement or create it.
      if (typeof document !== 'undefined') {
        documentElement = document.getElementById(documentElementId);

        if (documentElement === null) {
          documentElement = document.createElement('div');
          documentElement.id = documentElementId;
          document.body.appendChild(documentElement);
        }
      }

      (0, _staticProps2.default)(this)({ documentElement: documentElement });
    }

    _createClass(Canvas, [{
      key: 'render',
      value: function render(view) {
        var documentElement = this.documentElement;

        // TODO selectedItems, previousDraggingPoint, draggedLinkId, etc.
        // should be in components/Canvas state, not in emptyView.
        // Other attrivutes like pinRadius, fontWidth, nodeHeight should
        // be in defaultTheme or even better in components/Canvas defaultProps.

        var store = (0, _redux.createStore)(_reducers2.default, {
          view: Object.assign({
            height: _emptyView2.default.height,
            width: _emptyView2.default.width,
            node: _emptyView2.default.node,
            link: _emptyView2.default.link,
            selectedItems: _emptyView2.default.selectedItems,
            isDraggingItems: _emptyView2.default.isDraggingItems,
            previousDraggingPoint: _emptyView2.default.previousDraggingPoint,
            nodeSelector: _emptyView2.default.nodeSelector,
            draggedLinkId: _emptyView2.default.draggedLinkId,
            pinRadius: _emptyView2.default.pinRadius,
            nodeHeight: _emptyView2.default.nodeHeight,
            fontWidth: _emptyView2.default.fontWidth
          }, {
            node: view.node,
            link: view.link,
            height: view.height,
            width: view.width
          })
        }, window.devToolsExtension && window.devToolsExtension());

        (0, _reactDom.render)(_react2.default.createElement(
          _reactRedux.Provider,
          { store: store },
          _react2.default.createElement(_FlowView2.default, { documentElement: documentElement })
        ), documentElement);
      }
    }]);

    return Canvas;
  }();

  exports.default = Canvas;
  module.exports = exports['default'];
});