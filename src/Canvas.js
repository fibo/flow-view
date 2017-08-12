var EventEmitter = require('events')
var inherits = require('inherits')
var no = require('not-defined')
var React = require('react')
var ReactDOM = require('react-dom')
var svgx = require('svgx')

var Frame = require('./components/Frame')
var randomString = require('./utils/randomString')

// It is not a bad idea to include react-dom/server in the bundle.
// It is only 620 bytes, see https://gist.github.com/irae/2026a9655ca5ee8cd9e821c63435de1e
var reactDOMServer = require('react-dom/server')

// TODO find a better way to generate ids.
var idLength = 3
var defaultItem = Frame.defaultProps.item

function Canvas (containerId, item) {
  EventEmitter.apply(this, arguments)

  if (no(item)) item = defaultItem
  if (no(item.link)) item.link = defaultItem.link
  if (no(item.link.DefaultLink)) item.link = defaultItem.link.DefaultLink
  if (no(item.node)) item.node = defaultItem.node
  if (no(item.node.DefaultNode)) item.node.DefaultNode = defaultItem.node.DefaultNode
  if (no(item.nodeList)) item.nodeList = defaultItem.nodeList
  if (no(item.util)) item.util = defaultItem.util

  this.item = item

  // Check that containerId is a string.
  if (typeof containerId !== 'string') {
    throw new TypeError('containerId must be a string', containerId)
  }

  // If we are in browser context, get the document element containing
  // the canvas or create it.
  //
  // Cannot use if (document) or if(no(document)) otherwise
  // test/serverside/works.js will fail.
  if (typeof document !== 'undefined') {
    var container = document.getElementById(containerId)

    if (container === null) {
      container = document.createElement('div')
      container.id = containerId

      container.setAttribute('style', 'display: inline-block; height: 400px; width: 100%;')

      document.body.appendChild(container)
    }

    this.container = container
  } else {
    this.container = null
  }
}

inherits(Canvas, EventEmitter)

/**
 * Render to SVG.
 *
 * @param {Object} view
 * @param {Object} [model]
 * @param {Function} [callback] run server side
 */

function render (view, model, callback) {
  var container = this.container
  var item = this.item

  var height
  var width

  // Get height and width from container, if any.
  if (container) {
    var border = 1 // TODO could be configurable in style prop
    var rect = container.getBoundingClientRect()

    height = rect.height - (2 * border)
    width = rect.width - (2 * border)
  }

  if (no(view.height)) view.height = height
  if (no(view.link)) view.link = {}
  if (no(view.node)) view.node = {}
  if (no(view.width)) view.width = width

  var createInputPin = (nodeId, pin) => {
    var ins = view.node[nodeId].ins

    if (no(ins)) view.node[nodeId].ins = ins = []

    var position = ins.length

    if (no(pin)) pin = `in${position}`

    this.emit('createInputPin', nodeId, position, pin)

    view.node[nodeId].ins.push(pin)
  }

  var createOutputPin = (nodeId, pin) => {
    var outs = view.node[nodeId].outs

    if (no(outs)) view.node[nodeId].outs = outs = []

    var position = outs.length

    if (no(pin)) pin = `out${position}`

    this.emit('createOutputPin', nodeId, position, pin)

    view.node[nodeId].outs.push(pin)
  }

  var selectLink = (id) => {
    this.emit('selectLink', id)
  }

  var selectNode = (id) => {
    this.emit('selectNode', id)
  }

  function generateId () {
    var id = randomString(idLength)

    return (view.link[id] || view.node[id]) ? generateId() : id
  }

  var createLink = (link) => {
    var from = link.from
    var to = link.to

    var id = generateId()

    // Do not fire createLink event if it is a dragging link.
    if (no(to)) {
      view.link[id] = { from }
    } else {
      view.link[id] = { from, to }

      this.emit('createLink', { from, to }, id)
    }

    return id
  }

  var createNode = (node) => {
    var id = generateId()

    view.node[id] = node

    this.emit('createNode', node, id)

    return id
  }

  var deleteLink = (id) => {
    this.emit('deleteLink', id)

    delete view.link[id]
  }

  var deleteNode = (id) => {
    // delete links connected to given node.
    Object.keys(view.link).forEach((linkId) => {
      var from = view.link[linkId].from
      var to = view.link[linkId].to

      if (from && from[0] === id) {
        deleteLink(linkId)
      }

      if (to && to[0] === id) {
        deleteLink(linkId)
      }
    })

    delete view.node[id]

    this.emit('deleteNode', id)
  }

  var dragItems = (dragginDelta, draggedItems) => {
    Object.keys(view.node)
    .filter((id) => (draggedItems.indexOf(id) > -1))
    .forEach((id) => {
      view.node[id].x += dragginDelta.x
      view.node[id].y += dragginDelta.y
    })
  }

  var deleteInputPin = (nodeId, position) => {
    var ins = view.node[nodeId].ins

    if (no(ins)) return
    if (ins.length === 0) return

    if (no(position)) position = ins.length - 1

    // Look for connected links and delete them.

    Object.keys(view.link).forEach((id) => {
      var to = view.link[id].to

      if (no(to)) return

      if ((to[0] === nodeId) && (to[1] === position)) {
        deleteLink(id)
      }
    })

    this.emit('deleteInputPin', nodeId, position)

    view.node[nodeId].ins.splice(position, 1)
  }

  var endDragging = (selectNodes) => {
    var nodesCoordinates = {}

    selectNodes.forEach((id) => {
      nodesCoordinates.id = {}
      nodesCoordinates.id.x = view.node[id].x
      nodesCoordinates.id.y = view.node[id].y
    })

    this.emit('endDragging', nodesCoordinates)
  }

  var deleteOutputPin = (nodeId, position) => {
    var outs = view.node[nodeId].outs

    if (no(outs)) return
    if (outs.length === 0) return

    if (no(position)) position = outs.length - 1

    // Look for connected links and delete them.

    Object.keys(view.link).forEach((id) => {
      var from = view.link[id].from

      if (no(from)) return

      if ((from[0] === nodeId) && (from[1] === position)) {
        deleteLink(id)
      }
    })

    this.emit('deleteOutputPin', nodeId, position)

    view.node[nodeId].outs.splice(position, 1)
  }

  // TODO this is not used buy now.
  var renameNode = (nodeId, text) => {
    view.node[nodeId].text = text
  }

  var updateLink = (id, link) => {
    var to = link.to
    var from = link.from

    // Trigger a createLink event if it is a connected link.
    if (no(from)) {
      view.link[id].to = to

      this.emit('createLink', view.link[id], id)
    }
  }

  var component = (
    <Frame
      createInputPin={createInputPin}
      createOutputPin={createOutputPin}
      createLink={createLink}
      createNode={createNode}
      deleteLink={deleteLink}
      deleteInputPin={deleteInputPin}
      deleteNode={deleteNode}
      deleteOutputPin={deleteOutputPin}
      dragItems={dragItems}
      endDragging={endDragging}
      item={item}
      model={model}
      nodeList={item.nodeList}
      renameNode={renameNode}
      selectLink={selectLink}
      selectNode={selectNode}
      updateLink={updateLink}
      view={view}
    />
  )

  if (container) {
    // Client side rendering.
    ReactDOM.render(component, container)
  } else {
    // Server side rendering.

    var opts = { doctype: true, xmlns: true }

    var jsx = (
      <Frame
        item={item}
        view={view}
      />
    )

    var outputSVG = svgx(reactDOMServer.renderToStaticMarkup)(jsx, opts)

    if (typeof callback === 'function') {
      callback(null, outputSVG)
    }
  }
}

Canvas.prototype.render = render

module.exports = exports.default = Canvas
