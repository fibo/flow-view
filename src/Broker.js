
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

    var beforeAddLink = eventHook.beforeAddLink

    if (typeof beforeAddLink === 'function') {
      try {
        beforeAddLink(view, key)
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
}

Broker.prototype.init = init

module.exports = Broker

