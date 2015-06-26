
var inherits = require('inherits'),
    Pin      = require('./Pin')

function Input (node, position, numIns) {
  Pin.call(this, 'ins', node, position)

  this.link = null

  var canvas = node.canvas

  var theme = canvas.theme

  var fillPin     = theme.fillPin,
      halfPinSize = theme.halfPinSize

  var size = halfPinSize * 2

  var draw = canvas.draw

  function getVertex () {
    var vertex = {
          absolute: {},
          relative: {}
        }

    if (numIns > 1)
      vertex.relative.x = position * ((node.w - size) / (numIns - 1))
    else
      vertex.relative.x = 0

    vertex.relative.y = 0
    vertex.absolute.x = vertex.relative.x + node.x
    vertex.absolute.y = vertex.relative.y + node.y

    return vertex
  }

  Object.defineProperty(this, 'vertex', { get: getVertex })

  function getCenter () {
    var center = {
          absolute: {},
          relative: {}
        }

    var vertex = this.vertex

    center.relative.x = vertex.relative.x + halfPinSize
    center.relative.y = vertex.relative.y + halfPinSize
    center.absolute.x = center.relative.x + node.x
    center.absolute.y = center.relative.y + node.y

    return center
  }

  Object.defineProperty(this, 'center', { get: getCenter })

  var vertex = this.vertex.relative

  var rect = this.rect = draw.rect(size, size)
                             .move(vertex.x, vertex.y)
                             .fill(fillPin)

  node.group.add(rect)
}

inherits(Input, Pin)

module.exports = Input

