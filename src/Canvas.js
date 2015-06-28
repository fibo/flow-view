
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
    if (this.node[currentKey])
      return getNextKey()

    if (this.link[currentKey])
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
    var node = new Node(self, key)

    node.createView(view.node[key])

    self.node[key] = node
  }

  Object.keys(view.node).forEach(createNode)

  function createLink (key) {
    var link = new Link(self, key)

    link.createView(view.link[key])

    self.link[key] = link
  }

  Object.keys(view.link).forEach(createLink)
}

Canvas.prototype.createView = createView

function deleteView (view) {

}

Canvas.prototype.deleteView = deleteView

function readView () {
  var view = this.view
}

Canvas.prototype.readView = readView

function updateView (view) {

}

Canvas.prototype.updateView = updateView

function addLink (view, key) {
  if (typeof key === 'undefined')
     key = this.nextKey

  var link = new Link(this, view, key)

  this.link[key] = link

  link.createView(view)

  this.emit('addLink', { key: key, view: view })
}

Canvas.prototype.addLink = addLink

function addNode (view, key) {
  if (typeof key === 'undefined')
     key = this.nextKey

  var node = new Node(this, view, key)

  this.node[key] = node

  node.createView(view)

  this.emit('addNode', { key: key, view: view })
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
  node.group.remove()
  delete this.node[key]

  this.emit('delNode', key)
}

Canvas.prototype.delNode = delNode

function delLink (key) {
  var link = this.link[key]

  link.line.remove()

  delete this.link[key]

  this.emit('delLink', key)
}

Canvas.prototype.delLink = delLink

module.exports = Canvas

