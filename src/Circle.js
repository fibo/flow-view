
function Circle (box, position, numIns) {
  this.box      = box
  this.position = position

  this.link = null

  var canvas = box.canvas

  var theme = canvas.theme

  var fillCircle  = theme.fillCircle,
      fillLabel = theme.fillLabel,
      halfPinSize = theme.halfPinSize,
      labelFont = theme.labeFont

  var size = halfPinSize * 2

  var draw = canvas.draw

  function getVertex () {
    var vertex = {
          absolute: {},
          relative: {}
        }

    vertex.relative.x = box.w - size
    vertex.relative.y = (box.h / 2) - halfPinSize
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

  var circle = this.circle = draw.circle(size)
                                 .move(vertex.x , vertex.y)
                                 .fill(fillCircle)

  box.group.add(circle)

}

module.exports = Circle

