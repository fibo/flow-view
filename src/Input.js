
var Pin = require('./Pin')

class Input extends Pin (node, position) {
  constructor (node, position) {
    super('ins', node, position)

    this.link = null
  }

  render () {
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
}

module.exports = Input

