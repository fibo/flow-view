import React from 'react'
import { render } from 'react-dom'
import Frame from './components/Frame'
import EventEmitter from 'events'
import no from 'not-defined'
import randomString from './utils/randomString'
import renderSVGx from 'svgx'

// TODO find a better way to generate ids.
const idLength = 3

class Canvas extends EventEmitter {
  constructor (containerId, item) {
    super()

    this.container = null

    // Check that containerId is a string.
    if (typeof containerId !== 'string') {
      throw new TypeError('containerId must be a string', containerId)
    }

    // If we are in browser context, get the document element containing
    // the canvas or create it.
    if (typeof document !== 'undefined') {
      var container = document.getElementById(containerId)

      if (container === null) {
        container = document.createElement('div')
        container.id = containerId

        // Set height and width, including borders (400+1+1).
        container.setAttribute('style', 'height: 402px; width: 402px;')
        document.body.appendChild(container)
      }

      this.container = container

      this.item = item
    }
  }

  /**
   * Render to SVG.
   *
   * @param {Object} view
   * @param {Object} [model]
   * @param {Function} [callback] run server side
   */
  render (view, model, callback) {
    const container = this.container

    const defaultItem = Frame.defaultProps.item

    const DefaultInspector = defaultItem.inspector.DefaultInspector
    const DefaultLink = defaultItem.link.DefaultLink
    const DefaultNode = defaultItem.node.DefaultNode
    const typeOfNode = defaultItem.util.typeOfNode

    const item = Object.assign({},
      { inspector: { DefaultInspector } },
      { link: { DefaultLink } },
      { node: { DefaultNode } },
      { util: { typeOfNode } },
      this.item
    )

    // Default values for height and width.
    var height = 400
    var width = 400

    // Try to get height and width from container.
    if (container) {
      var rect = container.getBoundingClientRect()

      height = rect.height
      width = rect.width
    }

    view = Object.assign({}, {
      height,
      link: {},
      node: {},
      width
    }, view)

    const createInputPin = (nodeId, pin) => {
      var ins = view.node[nodeId].ins

      if (no(ins)) view.node[nodeId].ins = ins = []

      const position = ins.length

      if (no(pin)) pin = `in${position}`

      this.emit('createInputPin', nodeId, position, pin)

      view.node[nodeId].ins.push(pin)
    }

    const createOutputPin = (nodeId, pin) => {
      var outs = view.node[nodeId].outs

      if (no(outs)) view.node[nodeId].outs = outs = []

      const position = outs.length

      if (no(pin)) pin = `out${position}`

      this.emit('createOutputPin', nodeId, position, pin)

      view.node[nodeId].outs.push(pin)
    }

    function generateId () {
      const id = randomString(idLength)

      return (view.link[id] || view.node[id]) ? generateId() : id
    }

    const createLink = (link) => {
      const from = link.from
      const to = link.to

      const id = generateId()

      // Do not fire createLink event if it is a dragging link.
      if (no(to)) {
        view.link[id] = { from }
      } else {
        view.link[id] = { from, to }

        this.emit('createLink', { from, to }, id)
      }

      return id
    }

    const createNode = (node) => {
      const id = generateId()

      view.node[id] = node

      this.emit('createNode', node, id)

      return id
    }

    const deleteLink = (id) => {
      // Trigger a deleteLink event only if it is not a dragged link.
      if (view.link[id].to) {
        this.emit('deleteLink', id)
      }

      delete view.link[id]
    }

    const deleteNode = (id) => {
      // delete links connected to given node.
      Object.keys(view.link).forEach((linkId) => {
        const from = view.link[linkId].from
        const to = view.link[linkId].to

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

    const dragItems = (dragginDelta, draggedItems) => {
      Object.keys(view.node)
      .filter((id) => (draggedItems.indexOf(id) > -1))
      .forEach((id) => {
        view.node[id].x += dragginDelta.x
        view.node[id].y += dragginDelta.y
      })
    }

    const deleteInputPin = (nodeId, position) => {
      var ins = view.node[nodeId].ins

      if (no(ins)) view.node[nodeId].ins = ins = []

      if (no(position)) position = ins.length - 1

      this.emit('deleteInputPin', nodeId, position)

      view.node[nodeId].ins.splice(position, 1)
    }

    const deleteOutputPin = (nodeId, position) => {
      var outs = view.node[nodeId].outs

      if (no(outs)) view.node[nodeId].outs = outs = []

      if (no(position)) position = outs.length - 1

      this.emit('deleteOutputPin', nodeId, position)

      view.node[nodeId].outs.splice(position, 1)
    }

    const renameNode = (nodeId, text) => {
      view.node[nodeId].text = text
    }

    const updateLink = (id, link) => {
      const to = link.to
      const from = link.from

      // Trigger a createLink event if it is a connected link.
      if (no(from)) {
        view.link[id].to = to

        this.emit('createLink', view.link[id], id)
      }
    }

    const component = (
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
        item={item}
        model={model}
        renameNode={renameNode}
        updateLink={updateLink}
        view={view}
      />
    )

    if (container) {
      // Client side rendering.
      render(component, container)
    } else {
      // Server side rendering.

      const opts = { doctype: true, xmlns: true }
      const jsx = (
        <Frame
          item={item}
          view={view}
        />
      )

      const outputSVG = renderSVGx(jsx, opts)

      if (typeof callback === 'function') {
        callback(null, outputSVG)
      }
    }
  }
}

export default Canvas
