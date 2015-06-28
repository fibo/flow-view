
var EventEmitter = require('events').EventEmitter,
    inherits     = require('inherits'),
    SVG          = require('./SVG')

var Link          = require('./Link'),
    Node          = require('./Node'),
    NodeControls  = require('./NodeControls'),
    NodeCreator   = require('./NodeCreator'),
    NodeInspector = require('./NodeInspector')
    validate      = require('./validate')

var defaultTheme = require('./default/theme.json'),
    defaultView  = require('./default/view.json')

function Canvas (id) {
  var self = this

  var theme = defaultTheme
  this.theme = theme

  this.node = {}
  this.link = {}

  this.draw = SVG(id).size(1000, 1000)
                     .spof()

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

  var element = document.getElementById(id)

  SVG.on(element, 'dblclick', nodeCreator.show.bind(nodeCreator))
}

inherits(Canvas, EventEmitter)

function createView (view) {
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

Canvas.prototype.createView = createView

function deleteView (view) {

}

Canvas.prototype.deleteView = deleteView

function readView () {
  var view = { link: {}, node: {} }

  var link = this.link,
      node = this.node

  Object.keys(link).forEach(function (key) {
    view.link[key] = link[key].readView()
  })

  Object.keys(node).forEach(function (key) {
    view.node[key] = node[key].readView()
  })

  return view
}

Canvas.prototype.readView = readView

function updateView (view) {

}

Canvas.prototype.updateView = updateView

function addLink (view, key) {
  if (typeof key === 'undefined')
     key = this.nextKey

  var link = new Link(this, key)

  link.createView(view)

  this.link[key] = link

  this.emit('addLink', { link: { key: view } })
}

Canvas.prototype.addLink = addLink

function addNode (view, key) {
  if (typeof key === 'undefined')
     key = this.nextKey

  var node = new Node(this, key)

  node.createView(view)

  this.node[key] = node

  this.emit('addNode', { node: { key: view } })
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

  this.emit('delNode', key)
}

Canvas.prototype.delNode = delNode

function delLink (key) {
  var link = this.link[key]

  link.deleteView()

  this.emit('delLink', key)
}

Canvas.prototype.delLink = delLink

module.exports = Canvas

