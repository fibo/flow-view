
var Link = require('./Link')

class PreLink {
  constructor (canvas, output) {
    var svg   = canvas.svg,
        theme = canvas.theme

    var fillPinHighlighted = theme.fillPinHighlighted,
        halfPinSize        = theme.halfPinSize,
        strokeLine         = theme.strokeLine,
        strokeDasharray    = theme.strokeDasharray

    var pinSize = halfPinSize * 2

    var rect = svg.rect(pinSize, pinSize)
                  .fill(fillPinHighlighted)
                  .move(output.vertex.absolute.x, output.vertex.absolute.y)
                  .draggable()

    function getX1 () { return output.center.absolute.x }
    function getY1 () { return output.center.absolute.y }
    function getX2 () { return rect.x() + halfPinSize }
    function getY2 () { return rect.y() + halfPinSize }

    Object.defineProperty(this, 'x1', { get: getX1 })
    Object.defineProperty(this, 'y1', { get: getY1 })
    Object.defineProperty(this, 'x2', { get: getX2 })
    Object.defineProperty(this, 'y2', { get: getY2 })

    var line = svg.line(this.x1, this.y1, this.x2, this.y2)
                  .stroke(strokeLine)
                  .attr('stroke-dasharray', strokeDasharray)

    function remove () {
      output.preLink = null
      rect.remove()
      line.remove()
    }

    rect.on('mouseout', remove)

    function beforedrag () {
      rect.off('mouseout')
    }

    rect.on('beforedrag', beforedrag)

    function dragmove () {
      var x1 = getX1(),
          y1 = getY1(),
          x2 = getX2(),
          y2 = getY2()

      line.plot(x1, y1, x2, y2)
    }

    rect.on('dragmove', dragmove.bind(this))

    function dragend () {
      // After dragging, the preLink is no longer necessary.
      remove()

      var center = {}

      //center.x = rect.x() + halfPinSize
      center.x = getX2()
      //center.y = rect.y() + halfPinSize
      center.y = getY2()

      function isInside (center) {
        function centerIsInside (bbox, x, y) {
          var centerIsInsideX = ((center.x >= bbox.x + x) && (center.x <= bbox.x2 + x)),
              centerIsInsideY = ((center.y >= bbox.y + y) && (center.y <= bbox.y2 + y))

          return centerIsInsideX && centerIsInsideY
        }

        return centerIsInside
      }

      var centerIsInside = isInside(center)

      /**
      * Given a node, loop over its ins.
      * If center is inside input, create a Link.
      */

      function dropOn (node) {
        node.ins.forEach(function (input) {
          if (input.link !== null)
            return

          var bbox = input.rect.bbox(),
              x    = input.node.group.x(),
              y    = input.node.group.y()

          var centerIsInsideInput = centerIsInside(bbox, x, y)

          if (centerIsInsideInput) {
            var view = {
              from: [output.node.key, output.position],
              to: [node.key, input.position]
            }

            //canvas.addLink(view)
            canvas.broker.emit('addLink', view)
          }
        })
      }

      // Loop over all nodes. If center is inside node, drop on it.
      Object.keys(canvas.node).forEach(function (key) {
        var node = canvas.node[key]

        var bbox = node.group.bbox(),
              x  = node.x,
              y  = node.y

          var centerIsInsideBox = centerIsInside(bbox, x, y)

        if (centerIsInsideBox)
          dropOn(node)
      })
    }

    rect.on('dragend', dragend.bind(this))
  }
}

module.exports = PreLink

