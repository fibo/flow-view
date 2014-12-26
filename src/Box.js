
var Input  = require('./Input'),
    Output = require('./Output')

function Box (canvas, view, key) {
  this.canvas = canvas
  this.key = key

  var draw  = canvas.draw,
      theme = canvas.theme

  var fillLabel = theme.fillLabel,
      fillRect  = theme.fillRect,
      labelFont = theme.labeFont

  var h = theme.boxHeight,
      w = view.task.length * theme.labelFontWidth

  var group = this.group = draw.group()

  this.inputs = []
  this.output

  this.draw = draw

  var rect = this.rect = draw.rect(w, h)
                             .fill(fillRect)

  var text = this.text = draw.text(view.task)
                             .fill(fillLabel)
                             .back()
                             .move(10, 10)
                             .font(labelFont)

  group.add(rect)
       .add(text)
       .move(view.x, view.y)
       .draggable()

  Object.defineProperty(this, 'x', { get: function () { return group.x() } })
  Object.defineProperty(this, 'y', { get: function () { return group.y() } })
  Object.defineProperty(this, 'w', { get: function () { return rect.width() } })
  Object.defineProperty(this, 'h', { get: function () { return rect.height() } })

  var numIns = this.numIns = view.numIns

  for (var position = 0; position < numIns; position++) {
    this.inputs[position] = new Input(this, position, this.numIns)
  }

  this.output = new Output(this)

  function dragmove () {
    var output = this.output

    Object.keys(output.link).forEach(function (key) {
      var link = output.link[key]

      var x1 = link.x1
        , y1 = link.y1
        , x2 = link.x2
        , y2 = link.y2

      link.line.plot(x1, y1, x2, y2)
    })

    this.inputs.forEach(function (input) {
      var link = input.link

      if (!link) return

      var x1 = link.x1
        , y1 = link.y1
        , x2 = link.x2
        , y2 = link.y2

      link.line.plot(x1, y1, x2, y2)
    })
  }

  group.dragmove = dragmove.bind(this)
}

module.exports = Box

