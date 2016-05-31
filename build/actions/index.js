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

var addLink = exports.addLink = function addLink(link) {
  return {
    type: ADD_LINK,
    link: link
  };
};

var DEL_NODE = exports.DEL_NODE = 'DEL_NODE';

var delNode = exports.delNode = function delNode(id) {
  return {
    type: DEL_NODE,
    id: id
  };
};

var DEL_LINK = exports.DEL_LINK = 'DEL_LINK';

var delLink = exports.delLink = function delLink(id) {
  return {
    type: DEL_LINK,
    id: id
  };
};

var SELECT_ITEM = exports.SELECT_ITEM = 'SELECT_ITEM';

var selectItem = exports.selectItem = function selectItem(id) {
  return {
    type: SELECT_ITEM,
    id: id
  };
};