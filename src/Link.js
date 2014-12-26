
function Link (canvas, view, key) {
  var draw = canvas.draw

  var theme = canvas.theme

  var strokeLine = theme.strokeLine

  var position = view.position
  var from = canvas.box[view.from]
  var to = canvas.box[view.to]

  var end = to.inputs[position]
    , start = from.output

  Object.defineProperty(this, 'x1', { get: function () { return start.center.absolute.x } })
  Object.defineProperty(this, 'y1', { get: function () { return start.center.absolute.y } })
  Object.defineProperty(this, 'x2', { get: function () { return end.center.absolute.x } })
  Object.defineProperty(this, 'y2', { get: function () { return end.center.absolute.y } })

  var line = this.line = draw.line(this.x1, this.y1, this.x2, this.y2)
                             .stroke(strokeLine)

  end.link = this
  start.link[key] = this

  function remove () {
    end.link = null
    delete start.link[key]
    delete canvas.view.link[key]
    line.remove()
  }

  function deselectLine () {
    line.stroke(strokeLine)
    line.off('click')
  }

  function selectLine () {
    line.stroke({ width: 4 })
    line.on('click', remove)
  }

  line.on('mouseover', selectLine)
  line.on('mouseout', deselectLine)
}

module.exports = Link

