
var inherits = require('inherits'),
    Pin      = require('./Pin')

function Input (node, position) {
  Pin.call(this, 'ins', node, position)

  this.link = null
}

inherits(Input, Pin)

function render () {
  var fill   = this.fill,
      node   = this.node,
      size   = this.size,
      vertex = this.vertex.relative

  var svg = node.canvas.svg

  var rect = svg.rect(size, size)
                .move(vertex.x, vertex.y)
                .fill(fill)

  this.rect = rect

  node.group.add(rect)
}

Input.prototype.render = render

module.exports = Input

