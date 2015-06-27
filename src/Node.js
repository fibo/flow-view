
var Input   = require('./Input'),
    Output  = require('./Output')

function Node (canvas, view, key) {
  this.canvas = canvas
  this.key    = key

  var draw  = canvas.draw,
      theme = canvas.theme

  var fillLabel = theme.fillLabel,
      fillRect  = theme.fillRect,
      labelFont = theme.labeFont

  if (typeof view.text === 'undefined')
    view.text = 'callmename'

  if (typeof view.h === 'undefined')
    view.h = 1

  if (typeof view.w === 'undefined')
    view.w = view.text.length + 2

  var h = view.h * theme.unitHeight,
      w = view.w * theme.unitWidth

  var group = this.group = draw.group()

  this.ins  = []
  this.outs = []

  Object.defineProperties(this, {
    'numIns':  { get: function () { this.ins.length } },
    'numOuts': { get: function () { this.outs.length } }
  })

  var numIns  = 0,
      numOuts = 0

        /*
  if (view.ins) numIns = view.ins.length
  if (view.outs) numOuts = view.outs.length

  for (var i = 0; i < numIns; i++)
    this.ins[i] = new Input(this, i, numIns)

  for (var o = 0; o < numOuts; o++)
    this.outs[o] = new Output(this, o, numOuts)
    */

  this.draw = draw

  var rect = this.rect = draw.rect(w, h)
                             .fill(fillRect)

  var text = this.text = draw.text(view.text)
                             .fill(fillLabel)
                             .back()
                             .move(10, 10)
                             .font(labelFont)

  group.add(rect)
       .add(text)
       .move(view.x, view.y)
       .draggable()

  Object.defineProperties(this, {
    'x': { get: function () { return group.x()     } },
    'y': { get: function () { return group.y()     } },
    'w': { get: function () { return rect.width()  } },
    'h': { get: function () { return rect.height() } }
  })

  function dragmove () {
    this.outs.forEach(function (output) {
      Object.keys(output.link).forEach(function (key) {
        var link = output.link[key]

        if (link)
          link.linePlot()
      })
    })

    this.ins.forEach(function (input) {
      var link = input.link

      if (link)
        link.linePlot()
    })
  }

  group.on('dragmove', dragmove.bind(this))

  function dragstart () {
    canvas.nodeControls.detach()
  }

  group.on('dragstart', dragstart.bind(this))

  function showNodeControls (ev) {
    ev.stopPropagation()

    canvas.nodeControls.attachTo(this)
  }

  group.on('click', showNodeControls.bind(this))
}

function xCoordinateOf (pin) {
  var position = pin.position,
      size     = pin.size,
      type     = pin.type,
      w        = this.w,
      x

  var numPins = this[type].length

  if (numPins > 1)
      x = position * ((w - size) / (numPins - 1))
  else
      x = 0

  return x
}

Node.prototype.xCoordinateOf = xCoordinateOf

function addInput () {
    var numIns = this.numIns

    var position = numIns - 1

    var input = new Input(this, position, numIns)

    this.ins.push(input)
}

Node.prototype.addInput = addInput

function addOutput () {
    var numOuts = this.outs.length + 1

    var position = numOuts - 1

    var output = new Output(this, position, numOuts)

    this.outs.push(output)
}

Node.prototype.addOutput = addOutput

module.exports = Node

