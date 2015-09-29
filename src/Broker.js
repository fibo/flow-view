
// TODO create closures to generate hooks
// every hook can accept only one parameter, since addNode and addLink triggered
// by user input does not need to pass a key.

var EventEmitter = require('events').EventEmitter

class Broker extends EventEmitter {
  constructor (canvas) {
    super()

    this.canvas = canvas
  }
}

function init (eventHook) {
  var canvas = this.canvas

  function addLink (view, key) {
    if (typeof key === 'undefined')
      key = canvas.nextKey

    var beforeAdd = eventHook.beforeAddLink

    if (typeof beforeAdd === 'function') {
      try {
        beforeAdd(view, key)
        canvas.addLink(view, key)
      }
      catch (err) {
        console.error(err)
      }
    }
    else {
      canvas.addLink(view, key)
    }
  }

  this.on('addLink', addLink)

  function addInput (eventData) {
    var beforeAdd = eventHook.beforeAddInput

    var key      = eventData.node,
        position = eventData.position

    var node = canvas.node[key]

    if (typeof beforeAdd === 'function') {
      try {
        beforeAdd(eventData)
        node.addInput(position)
      }
      catch (err) {
        console.error(err)
      }
    }
    else {
      node.addInput(position)
    }
  }

  this.on('addInput', addInput)

  function addNode (view, key) {
    if (typeof key === 'undefined')
      key = canvas.nextKey

    var beforeAdd = eventHook.beforeAddNode

    if (typeof beforeAdd === 'function') {
      try {
        beforeAdd(view, key)
        canvas.addNode(view, key)
      }
      catch (err) {
        console.error(err)
      }
    }
    else {
      canvas.addNode(view, key)
    }
  }

  this.on('addNode', addNode)

  function delLink (key) {
    var beforeDel = eventHook.beforeDelLink

    if (typeof beforeDel === 'function') {
      try {
        beforeDel(key)
        canvas.delLink(key)
      }
      catch (err) {
        console.error(err)
      }
    }
    else {
      canvas.delLink(key)
    }
  }

  this.on('delLink', delLink)

  function delNode (key) {
    var beforeDel = eventHook.beforeDelNode

    if (typeof beforeDel === 'function') {
      try {
        beforeDel(key)
        canvas.delNode(key)
      }
      catch (err) {
        console.error(err)
      }
    }
    else {
      canvas.delNode(key)
    }
  }

  this.on('delNode', delNode)

  function moveNode (eventData) {
    var afterMove = eventHook.afterMoveNode

    if (typeof afterMove === 'function')
      afterMove(eventData)
  }

  this.on('moveNode', moveNode)
}

Broker.prototype.init = init

module.exports = Broker

