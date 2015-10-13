
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

  var nextKey = 0

  function getNextKey () {
    var currentKey = ++nextKey + ''

    // Make next key unique.
    if (self.node[currentKey])
      return getNextKey()

    if (self.link[currentKey])
      return getNextKey()

    return currentKey
  }

  Object.defineProperty(this, 'nextKey', { get: getNextKey })

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

  function createNode (key) {
    var data = view.node[key]
    data.nodeid = key

    self.addNode(data)
  }

  Object.keys(view.node).forEach(createNode)

  function createLink (key) {
    var data = view.link[key]
    data.linkid = key

    self.addLink(data)
  }

  Object.keys(view.link).forEach(createLink)
}

Canvas.prototype.render = render

/**
 * Get model.
 *
 * @returns {Object} json
 */

function toJSON () {
  var view = { link: {}, node: {} }

  var link = this.link,
      node = this.node

  Object.keys(link).forEach(function (key) {
    view.link[key] = link[key].toJSON()
  })

  Object.keys(node).forEach(function (key) {
    view.node[key] = node[key].toJSON()
  })

  return view
}

Canvas.prototype.toJSON = toJSON

/**
 * Add a link.
 */

function addLink (data) {
  var key = data.linkid

  if (typeof key === 'undefined')
     key = this.nextKey

  var link = new Link(this, key)

  link.render(data)

  this.link[key] = link
}

Canvas.prototype.addLink = addLink

/**
 * Add a node.
 */

function addNode (data) {
  var key = data.nodeid

  if (typeof key === 'undefined')
     key = this.nextKey

  var node = new Node(this, key)

  node.render(data)

  this.node[key] = node
}

Canvas.prototype.addNode = addNode

/**
 * Delete a node.
 */

function delNode (data) {
  var key = data.nodeid

  var link = this.link,
      node = this.node[key]

  // First remove links connected to node.
  for (var i in link) {
    var nodeIsSource = link[i].from.key === key,
        nodeIsTarget = link[i].to.key   === key

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
  var key = data.linkid

  var link = this.link[key]

  link.deleteView()
}

Canvas.prototype.delLink = delLink

/**
 * Move a node.
 */

function moveNode (data) {
  var key = data.nodeid,
      x   = data.x,
      y   = data.y

  this.node[key].x = x
  this.node[key].y = y
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

