
var SVG = require('./SVG')

var Broker        = require('./Broker'),
    Link          = require('./Link'),
    Node          = require('./Node'),
    NodeControls  = require('./NodeControls'),
    NodeCreator   = require('./NodeCreator'),
    validate      = require('./validate')

var defaultTheme = require('./default/theme.json'),
    defaultView  = require('./default/view.json')

/**
 * Create a flow-view canvas
 *
 * @constructor
 * @param {String} id of div
 * @param {Object} arg can contain width, height, eventHooks
 */

function Canvas (id, arg) {
  var self = this

  if (typeof arg === 'undefined')
    arg = {}

  var eventHooks = arg.eventHooks || {}

  var broker = new Broker(this)
  broker.init(eventHooks)
  this.broker = broker

  var theme = defaultTheme
  this.theme = theme

  this.node = {}
  this.link = {}

  var svg = this.svg = SVG(id).spof()

  var element = document.getElementById(id)

  var height = arg.height || element.clientHeight,
      width  = arg.width  || element.clientWidth

  svg.size(width, height)

  function getHeight () { return height }

  function setHeight (value) {
    height = value
    svg.size(height, width).spof()
  }

  Object.defineProperty(this, 'height', {get: getHeight, set: setHeight});

  function getWidth () { return width }

  function setWidth (value) {
    width = value
    svg.size(height, width).spof()
  }

  Object.defineProperty(this, 'width', {get: getWidth, set: setWidth});

  var nextId = 0

  function getNextId () {
    var currentId = ++nextId + ''

    // Make next id unique.
    if (self.node[currentId])
      return getNextId()

    if (self.link[currentId])
      return getNextId()

    return currentId
  }

  Object.defineProperty(this, 'nextId', { get: getNextId })

  var nodeCreator  = new NodeCreator(this)
  this.nodeCreator = nodeCreator

  var nodeControls = new NodeControls(this)
  this.nodeControls = nodeControls

  var hideNodeCreator = nodeCreator.hide.bind(nodeCreator),
      showNodeCreator = nodeCreator.show.bind(nodeCreator)

  SVG.on(element, 'click',    hideNodeCreator)
  SVG.on(element, 'dblclick', showNodeCreator)
}

function render (view) {
  validate(view)

  var self = this

  function createNode (id) {
    var data = view.node[id]
    data.nodeid = id

    self.addNode(data)
  }

  Object.keys(view.node)
        .forEach(createNode)

  function createLink (id) {
    var data = view.link[id]
    data.linkid = id

    self.addLink(data)
  }

  Object.keys(view.link)
        .forEach(createLink)
}

Canvas.prototype.render = render

function deleteView () {

  var link = this.link,
      node = this.node

  Object.keys(node).forEach(function (id) { node[id].deleteView() })
  Object.keys(link).forEach(function (id) { link[id].deleteView() })
}

Canvas.prototype.deleteView = deleteView

/**
 * Get model.
 *
 * @returns {Object} json
 */

function toJSON () {
  var view = { link: {}, node: {} }

  var link = this.link,
      node = this.node

  Object.keys(link).forEach(function (id) {
    view.link[id] = link[id].toJSON()
  })

  Object.keys(node).forEach(function (id) {
    view.node[id] = node[id].toJSON()
  })

  return view
}

Canvas.prototype.toJSON = toJSON

/**
 * Add a link.
 */

function addLink (data) {
  var id = data.linkid

  if (typeof id === 'undefined')
     id = this.nextId

  var link = new Link(this, id)

  link.render(data)

  this.link[id] = link
}

Canvas.prototype.addLink = addLink

/**
 * Add a node.
 */

function addNode (data) {
  var id = data.nodeid

  if (typeof id === 'undefined')
     id = this.nextId

  var node = new Node(this, id)

  node.render(data)

  this.node[id] = node
}

Canvas.prototype.addNode = addNode

/**
 * Delete a node.
 */

function delNode (data) {
  var id = data.nodeid

  var link = this.link,
      node = this.node[id]

  // First remove links connected to node.
  for (var i in link) {
    var nodeIsSource = link[i].from.id === id,
        nodeIsTarget = link[i].to.id   === id

    if (nodeIsSource || nodeIsTarget)
      this.broker.emit('delLink', { linkid: i })
  }

  // Then remove node.
  node.deleteView()
}

Canvas.prototype.delNode = delNode

/**
 * Delete a link.
 */

function delLink (data) {
  var id = data.linkid

  var link = this.link[id]

  link.deleteView()
}

Canvas.prototype.delLink = delLink

/**
 * Move a node.
 */

function moveNode (data) {
  var id = data.nodeid,
      x   = data.x,
      y   = data.y

  this.node[id].x = x
  this.node[id].y = y
}

Canvas.prototype.moveNode = moveNode

/**
 * Rename a node.
 */

function renameNode (data) {
  // TODO add renameNode event to Broker
  var id   = data.id,
      text = data.text

  this.node[id].text = text
}

Canvas.prototype.renameNode = renameNode

module.exports = Canvas

