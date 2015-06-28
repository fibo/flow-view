
var inherits = require('inherits'),
    Pin      = require('./Pin')

function Input (node, position) {
  Pin.call(this, 'ins', node, position)

  this.link = null
}

inherits(Input, Pin)

function createView (view) {
  var self = this

  var node = this.node

  var canvas = node.canvas

  var theme = canvas.theme

  var fillPin     = theme.fillPin,
      halfPinSize = theme.halfPinSize

  var size = halfPinSize * 2

  var draw = canvas.draw

  var vertex = this.vertex.relative

  var rect = draw.rect(size, size)
                 .move(vertex.x, vertex.y)
                 .fill(fillPin)

  this.rect = rect

  node.group.add(rect)
}

Input.prototype.createView = createView

module.exports = Input

