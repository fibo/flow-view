(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.index = mod.exports;
  }
})(this, function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var ADD_NODE = exports.ADD_NODE = 'ADD_NODE';

  var addNode = exports.addNode = function addNode(node) {
    return {
      type: ADD_NODE,
      node: node
    };
  };

  var ADD_LINK = exports.ADD_LINK = 'ADD_LINK';

  var addLink = exports.addLink = function addLink(link, previousDraggingPoint) {
    return {
      type: ADD_LINK,
      link: link,
      previousDraggingPoint: previousDraggingPoint
    };
  };

  var DEL_NODE = exports.DEL_NODE = 'DEL_NODE';

  var delNode = exports.delNode = function delNode(id) {
    return {
      type: DEL_NODE,
      id: id
    };
  };

  var DELETE_LINK = exports.DELETE_LINK = 'DELETE_LINK';

  var deleteLink = exports.deleteLink = function deleteLink(id) {
    return {
      type: DELETE_LINK,
      id: id
    };
  };

  var DRAG_ITEMS = exports.DRAG_ITEMS = 'DRAG_ITEMS';

  var dragItems = exports.dragItems = function dragItems(previousDraggingPoint, draggingDelta) {
    return {
      type: DRAG_ITEMS,
      previousDraggingPoint: previousDraggingPoint,
      draggingDelta: draggingDelta
    };
  };

  var DRAG_LINK = exports.DRAG_LINK = 'DRAG_LINK';

  var dragLink = exports.dragLink = function dragLink(previousDraggingPoint, draggingDelta) {
    return {
      type: DRAG_LINK,
      previousDraggingPoint: previousDraggingPoint,
      draggingDelta: draggingDelta
    };
  };

  var END_DRAGGING_ITEMS = exports.END_DRAGGING_ITEMS = 'END_DRAGGING_ITEMS';

  var endDraggingItems = exports.endDraggingItems = function endDraggingItems() {
    return {
      type: END_DRAGGING_ITEMS
    };
  };

  var END_DRAGGING_LINK = exports.END_DRAGGING_LINK = 'END_DRAGGING_LINK';

  var endDraggingLink = exports.endDraggingLink = function endDraggingLink(id, link) {
    return {
      type: END_DRAGGING_LINK,
      id: id,
      link: link
    };
  };

  var HIDE_NODE_SELECTOR = exports.HIDE_NODE_SELECTOR = 'HIDE_NODE_SELECTOR';

  var hideNodeSelector = exports.hideNodeSelector = function hideNodeSelector() {
    return {
      type: HIDE_NODE_SELECTOR
    };
  };

  var SELECT_ITEM = exports.SELECT_ITEM = 'SELECT_ITEM';

  var selectItem = exports.selectItem = function selectItem(_ref) {
    var id = _ref.id;
    var x = _ref.x;
    var y = _ref.y;
    return {
      type: SELECT_ITEM,
      id: id,
      x: x,
      y: y
    };
  };

  var SET_NODE_SELECTOR_TEXT = exports.SET_NODE_SELECTOR_TEXT = 'SET_NODE_SELECTOR_TEXT';

  var setNodeSelectorText = exports.setNodeSelectorText = function setNodeSelectorText(text) {
    return {
      type: SET_NODE_SELECTOR_TEXT,
      text: text
    };
  };

  var SET_NUM_INS = exports.SET_NUM_INS = 'SET_NUM_INS';

  var setNumIns = exports.setNumIns = function setNumIns(_ref2) {
    var nodeid = _ref2.nodeid;
    var num = _ref2.num;
    return {
      type: SET_NUM_INS,
      nodeid: nodeid,
      num: num
    };
  };

  var SET_NUM_OUTS = exports.SET_NUM_OUTS = 'SET_NUM_OUTS';

  var setNumOuts = exports.setNumOuts = function setNumOuts(_ref3) {
    var nodeid = _ref3.nodeid;
    var num = _ref3.num;
    return {
      type: SET_NUM_OUTS,
      nodeid: nodeid,
      num: num
    };
  };

  var SHOW_NODE_SELECTOR = exports.SHOW_NODE_SELECTOR = 'SHOW_NODE_SELECTOR';

  var showNodeSelector = exports.showNodeSelector = function showNodeSelector(_ref4) {
    var x = _ref4.x;
    var y = _ref4.y;
    return {
      type: SHOW_NODE_SELECTOR,
      x: x,
      y: y
    };
  };
});