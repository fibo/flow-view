
var SVG = require('./SVG')

var Broker        = require('./Broker'),
    Link          = require('./Link'),
    Node          = require('./Node'),
    NodeControls  = require('./NodeControls'),
    NodeCreator   = require('./NodeCreator'),
    NodeInspector = require('./NodeInspector')
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

  var broker = new Broker(this)
  broker.init(arg.eventHooks)
  this.broker = broker

  var theme = defaultTheme
  this.theme = theme

  this.node = {}
  this.link = {}

  var svg = this.svg = SVG(id)

  var element = document.getElementById(id)

  var height = element.clientHeight,
      width  = element.clientWidth

  svg.size(width, height).spof()

  function getHeight () { return height }

  Object.defineProperty(this, 'height', { get: getHeight });

  function getWidth () { return width }

  Object.defineProperty(this, 'width', { get: getWidth });

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

  var nodeInspector  = new NodeInspector(this)
  this.NodeInspector = NodeInspector

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
    self.addNode(view.node[key], key)
  }

  Object.keys(view.node).forEach(createNode)

  function createLink (key) {
    self.addLink(view.link[key], key)
  }

  Object.keys(view.link).forEach(createLink)
}

Canvas.prototype.render = render

/**
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

function addLink (view, key) {
  if (typeof key === 'undefined')
     key = this.nextKey

  var link = new Link(this, key)

  link.render(view)

  this.link[key] = link

  var eventData = { link: {} }
  eventData.link[key] = view
}

Canvas.prototype.addLink = addLink

function addNode (view, key) {
  if (typeof key === 'undefined')
     key = this.nextKey

  var node = new Node(this, key)

  node.render(view)

  this.node[key] = node

  var eventData = { node: {} }
  eventData.node[key] = view
}

Canvas.prototype.addNode = addNode

function delNode (key) {
  var link = this.link,
      node = this.node[key]

  // First remove links connected to node.
  for (var i in link) {
    var nodeIsSource = link[i].from.key === key,
        nodeIsTarget = link[i].to.key   === key

    if (nodeIsSource || nodeIsTarget)
      this.delLink(i)
  }

  // Then remove node.
  node.deleteView()
}

Canvas.prototype.delNode = delNode

function delLink (key) {
  var link = this.link[key]

  link.deleteView()
}

Canvas.prototype.delLink = delLink

module.exports = Canvas

