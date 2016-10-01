import React from 'react'
import { render } from 'react-dom'
import Canvas from './components/Canvas'
import EventEmitter from 'events'
import no from 'not-defined'
import randomString from './utils/randomString'
import renderSVGx from 'svgx'

import DefaultInspector from './components/Inspector'
import DefaultLink from './components/Link'
import DefaultNode from './components/Node'

// TODO find a better way to generate ids.
const idLength = 3

class FlowViewCanvas extends EventEmitter {
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
   * @param {Function} [callback] run server side
   */
  render (view, callback) {
    const container = this.container
    const item = Object.assign({},
      { inspector: { DefaultInspector } },
      { link: { DefaultLink } },
      { node: { DefaultNode } },
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

    const createLink = (link) => {
      function generateId () {
        const id = randomString(idLength)
        return link[id] ? generateId() : id
      }

      const id = generateId()

      view.link[id] = link

      // Do not fire createLink event if it is a dragging link.
      if (link.to) {
        this.emit('createLink', link, id)
      }

      return id
    }

    const createNode = (node) => {
      function generateId () {
        const id = randomString(idLength)
        return node[id] ? generateId() : id
      }

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
          delete view.link[linkId]

          this.emit('deleteLink', linkId)
        }

        if (to && to[0] === id) {
          delete view.link[linkId]

          this.emit('deleteLink', linkId)
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

    const updateLink = (id, link) => {
      // Trigger a createLink event if it is a connected link.
      if (link.to) {
        this.emit('createLink', link, id)
      } else {
        this.emit('deleteLink', link, id)
      }

      view.link[id] = Object.assign(view.link[id], link)
    }

    const component = (
      <Canvas
        createInputPin={createInputPin}
        createOutputPin={createOutputPin}
        createLink={createLink}
        createNode={createNode}
        deleteLink={deleteLink}
        deleteNode={deleteNode}
        dragItems={dragItems}
        item={item}
        deleteInputPin={deleteInputPin}
        deleteOutputPin={deleteOutputPin}
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
        <Canvas
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

export default FlowViewCanvas
