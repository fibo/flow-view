
var inherits = require('inherits'),
    Pin      = require('./Pin'),
    PreLink  = require('./PreLink')

function Output (node, position) {
  Pin.call(this, 'outs', node, position)

  this.link = {}
}

inherits(Output, Pin)

function createView (view) {
  var self = this

  // TODO for var i in view this.set(i, view[i])
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

  node.group.add(rect)

  var preLink = null

  function mouseover () {
    preLink = new PreLink(canvas, this)
  }

  rect.on('mouseover', mouseover.bind(this))
}

Output.prototype.createView = createView

module.exports = Output

