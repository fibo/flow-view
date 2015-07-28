
// TODO create closures to generate hooks
// every hook can accept only one parameter, since addNode and addLink triggered
// by user input does not need to pass a key.

var EventEmitter = require('events').EventEmitter,
    inherits     = require('inherits')

function Broker (canvas) {
  this.canvas = canvas
}

inherits(Broker, EventEmitter)

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
        console.log(err)
      }
    }
    else {
      canvas.addLink(view, key)
    }
  }

  this.on('addLink', addLink)

  function addNode (view, key) {
    if (typeof key === 'undefined')
      key = canvas.nextKey

    var beforeAdd = eventHook.beforeAddNode

    if (typeof before === 'function') {
      try {
        beforeAdd(view, key)
        canvas.addNode(view, key)
      }
      catch (err) {
        console.log(err)
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
        console.log(err)
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
        console.log(err)
      }
    }
    else {
      canvas.delNode(key)
    }
  }

  this.on('delNode', delNode)

  function moveNode (eventData) {
    var beforeMove = eventHook.beforeMoveNode

    if (typeof beforeMove === 'function') {
      try {
        beforeMove(key)
        canvas.moveNode(eventData)
      }
      catch (err) {
        console.log(err)
      }
    }
    else {
      canvas.moveNode(eventData)
    }
  }

  this.on('moveNode', moveNode)
}

Broker.prototype.init = init

module.exports = Broker

