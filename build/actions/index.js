'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var ADD_LINK = exports.ADD_LINK = 'ADD_LINK';
var ADD_NODE = exports.ADD_NODE = 'ADD_NODE';
var DEL_LINK = exports.DEL_LINK = 'DEL_LINK';
var DEL_NODE = exports.DEL_NODE = 'DEL_NODE';

var addNode = exports.addNode = function addNode(node) {
  return {
    type: ADD_NODE,
    node: node
  };
};

var addLink = exports.addLink = function addLink(link) {
  return {
    type: ADD_LINK,
    link: link
  };
};

var delNode = exports.delNode = function delNode(nodeid) {
  return {
    type: DEL_NODE,
    nodeid: nodeid
  };
};

var delLink = exports.delLink = function delLink(linkid) {
  return {
    type: DEL_LINK,
    linkid: linkid
  };
};