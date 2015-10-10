
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
        console.error(err)
      }
    }
    else {
      canvas.addLink(view, key)
    }
  }

  this.on('addLink', addLink)

  /**
   * Generate addInput or addOutput event callback
   *
   * @api private
   *
   * @param {String} type can be In or Out
   *
   * @returns {Function} anonymous
   */

  function addPin (type) {
    return function (eventData) {
      // Can be addInput or addOutput.
      var action = 'add' + type + 'put'

      // Can be beforeAddInput or beforeAddOutput hook.
      var beforeAdd = eventHook['beforeAdd' + type + 'put']

      var key      = eventData.nodeKey,
          position = eventData.position

      var node = canvas.node[key]

      if (typeof beforeAdd === 'function') {
        try {
          beforeAdd(eventData)
          node[action](position)
        }
        catch (err) {
          console.error(err)
        }
      }
      else {
        node[action](position)
      }
    }
  }

  this.on('addInput', addPin('In'))
  this.on('addOutput', addPin('Out'))

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

  /**
   * Generate delLink or delNode event callback
   *
   * @api private
   *
   * @param {String} type can be Link or Node
   *
   * @returns {Function} anonymous
   */

  function del (type) {
    return function (key) {
      // Can be delLink or delNode.
      var action = 'del' + type

      // Can be beforeAddInput or beforeAddOutput hook.
      var beforeDel = eventHook['beforeDel' + type]

      if (typeof beforeDel === 'function') {
        try {
          beforeDel(key)
          canvas[action](key)
        }
        catch (err) {
          console.error(err)
        }
      }
      else {
        canvas[action](key)
      }
    }
  }

  this.on('delLink', del('Link'))
  this.on('delNode', del('Node'))

  function moveNode (eventData) {
    var afterMove = eventHook.afterMoveNode

    if (typeof afterMove === 'function')
      afterMove(eventData)
  }

  this.on('moveNode', moveNode)
}

Broker.prototype.init = init

module.exports = Broker

