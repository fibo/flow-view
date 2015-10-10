
var Input   = require('./Input'),
    Output  = require('./Output')

function Node (canvas, key) {
  this.canvas = canvas
  this.key    = key

  this.group = canvas.svg.group()

  this.ins  = []
  this.outs = []
}

function render (view) {
  var self = this

  var canvas = this.canvas,
      group  = this.group,
      key    = this.key

  var svg   = canvas.svg,
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

  var ins  = view.ins  || [],
      outs = view.outs || []

  var rect = svg.rect(w, h)
                .fill(fillRect)

  var text = svg.text(view.text)
                .fill(fillLabel)
                .back()
                .move(10, 10)
                .font(labelFont)

  group.add(rect)
       .add(text)

  Object.defineProperties(self, {
    'x': { get: function () { return group.x()     } },
    'y': { get: function () { return group.y()     } },
    'w': { get: function () { return rect.width()  } },
    'h': { get: function () { return rect.height() } }
  })

  function createInput (inputView, position) {
    self.addInput(position, inputView)
  }

  ins.forEach(createInput)

  function createOutput (outputView, position) {
    self.addOutput(position, outputView)
  }

  outs.forEach(createOutput)

  function dynamicConstraint (x, y) {
    var horyzontalContraint = (x > 0) && (x < canvas.width  - self.w),
        verticalContraint   = (y > 0) && (y < canvas.height - self.h)

    return { x: horyzontalContraint, y: verticalContraint }
  }

  group.move(view.x, view.y)
       .draggable(dynamicConstraint)

  // Click on a node, without dragging it, actually fires dragstart, dragmove (once)
  // and dragend. It is necessary to keep track of how many dragMoves were to realize if
  // node was really dragged.
  var dragMoves = -1

  function dragend () {
    var eventData = { node: {} }
    eventData.node[key] = {x: self.x, y: self.y}

    if (dragMoves > 0)
      canvas.broker.emit('moveNode', eventData)
  }

  group.on('dragend', dragend)

  function dragmove () {
    // First time node is clicked, dragMoves will be eqal to zero.
    dragMoves++

    self.outs.forEach(function (output) {
      Object.keys(output.link).forEach(function (key) {
        var link = output.link[key]

        if (link)
          link.linePlot()
      })
    })

    self.ins.forEach(function (input) {
      var link = input.link

      if (link)
        link.linePlot()
    })
  }

  group.on('dragmove', dragmove)

  function dragstart () {
    dragMoves = -1
    canvas.nodeControls.detach()
  }

  group.on('dragstart', dragstart)

  function showNodeControls (ev) {
    ev.stopPropagation()

    canvas.nodeControls.attachTo(this)
  }

  group.on('click', showNodeControls.bind(this))
}

Node.prototype.render = render

function toJSON () {
  var view = { ins: [], outs: [] }

  var ins  = this.ins,
      outs = this.outs

  view.text = this.text

  ins.forEach(function (position) {
    view.ins[position] = ins[position].toJSON()
  })

  outs.forEach(function (position) {
    view.outs[position] = outs[position].toJSON()
  })

  return view
}

Node.prototype.toJSON = toJSON

function deleteView () {
  var canvas = this.canvas,
      group  = this.group,
      key    = this.key

  group.remove()

  delete canvas.node[key]
}

Node.prototype.deleteView = deleteView

function xCoordinateOf (pin) {
  var position = pin.position

  if (position === 0)
    return 0

  var size = pin.size,
      type = pin.type,
      w    = this.w

  var numPins = this[type].length

  if (numPins > 1)
    return position * ((w - size) / (numPins - 1))
}

Node.prototype.xCoordinateOf = xCoordinateOf

function addPin (type, position) {
  var newPin,
      numPins = this[type].length

  if (typeof position === 'undefined')
    position = numPins

  if (type === 'ins')
    newPin = new Input(this, position)

  if (type === 'outs')
    newPin = new Output(this, position)

  this[type].splice(position, 0, newPin)

  newPin.render()

  // Nothing more to do it there is no pin yet.
  if (numPins === 0)
    return

  // Update link view for outputs.
  function updateLinkViews (pin, key) {
    pin.link[key].linePlot()
  }

  // Move existing pins to new position.
  // Start loop on i = 1, the second position. The first pin is not moved.
  // The loop ends at numPins + 1 cause one pin was added.
  for (var i = 1; i < numPins + 1; i++) {
    // Nothing to do for input added right now.
    if (i === position)
      continue

    var pin

    if (i < position)
      pin = this[type][i]

    // After new pin position, it is necessary to use i + 1 as index.
    if (i > position)
      pin = this[type][i + 1]

    var rect   = pin.rect,
        vertex = pin.vertex.relative

    rect.move(vertex.x, vertex.y)

    // Move also any link connected to pin.
    if (type === 'ins')
      if (pin.link)
        pin.link.linePlot()

    if (type === 'outs')
      Object.keys(pin.link).forEach(updateLinkViews.bind(null, pin))
  }
}

function addInput (position) {
  addPin.bind(this)('ins', position)
}

Node.prototype.addInput = addInput

function addOutput (position) {
  addPin.bind(this)('outs', position)
}

Node.prototype.addOutput = addOutput

module.exports = Node

