
var PreLink = require('./PreLink')

function Output (box, position, numOuts) {
  this.box      = box
  this.position = position

  this.link = {}

  var canvas = box.canvas

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

    if (numOuts > 1)
      vertex.relative.x = position * ((box.w - size) / (numOuts - 1))
    else
      vertex.relative.x = 0

    vertex.relative.y = box.h - size
    vertex.absolute.x = vertex.relative.x + box.x
    vertex.absolute.y = vertex.relative.y + box.y

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
    center.absolute.x = center.relative.x + box.x
    center.absolute.y = center.relative.y + box.y

    return center
  }

  Object.defineProperty(this, 'center', { get: getCenter })

  var vertex = this.vertex.relative

  var rect = this.rect = draw.rect(size, size)
                             .move(vertex.x, vertex.y)
                             .fill(fillPin)

  box.group.add(rect)

  var preLink = null

  function mouseover () {
    preLink = new PreLink(canvas, this)
  }

  rect.on('mouseover', mouseover.bind(this))
}

module.exports = Output

