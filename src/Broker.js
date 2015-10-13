
var EventEmitter = require('events').EventEmitter,
    inherits     = require('inherits')

function Broker (canvas) {
  this.canvas = canvas
}

inherits(Broker, EventEmitter)

function init (eventHook) {
  var canvas = this.canvas

  /**
   * On addLink event.
   *
   * @api private
   */

  function addLink (eventData) {
    canvas.addLink(eventData)
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

      var id       = eventData.nodeid,
          position = eventData.position

      var node = canvas.node[id]

      node[action](position)
    }
  }

  this.on('addInput', addPin('In'))
  this.on('addOutput', addPin('Out'))

  /**
   * On addNode event.
   *
   * @api private
   */

  function addNode (eventData) {
    canvas.addNode(eventData)
  }

  this.on('addNode', addNode)

  /**
   * On delNode event.
   *
   * @api private
   */

  function delNode (eventData) {
    canvas.delNode(eventData)
  }

  this.on('delNode', delNode)

  /**
   * On delLink event.
   *
   * @api private
   */

  function delLink (eventData) {
    canvas.delLink(eventData)
  }

  this.on('delLink', delLink)

  /**
   * On moveNode event.
   *
   * @api private
   */

  function moveNode (eventData) {
    canvas.moveNode(eventData)
  }

  this.on('moveNode', moveNode)
}

Broker.prototype.init = init

module.exports = Broker

