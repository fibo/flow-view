import React from 'react'
import { render } from 'react-dom'
import Canvas from './components/Canvas'
import EventEmitter from 'events'
import no from 'not-defined'
import randomString from './utils/randomString'
import renderSVGx from 'svgx'

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
    if (document) {
      var container = document.getElementById(containerId)

      if (container === null) {
        container = document.createElement('div')
        container.id = containerId
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
    const item = this.item

    const addInputPin = (nodeId, pin) => {
      var ins = view.node[nodeId].ins

      if (no(ins)) view.node[nodeId].ins = ins = []

      const position = ins.length

      if (no(pin)) pin = `in${position}`

      view.node[nodeId].ins.push(pin)
    }

    const addOutputPin = (nodeId, pin) => {
      var outs = view.node[nodeId].outs

      if (no(outs)) view.node[nodeId].outs = outs = []

      const position = outs.length

      if (no(pin)) pin = `out${position}`

      view.node[nodeId].outs.push(pin)
    }

    const createLink = (link) => {
      function generateId () {
        const id = randomString(idLength)
        return link[id] ? generateId() : id
      }

      const id = generateId()

      view.link[id] = link

      this.emit('createLink', link, id)

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
      delete view.link[id]

      this.emit('deleteLink', id)
    }

    const deleteNode = (id) => {
      // Remove links connected to given node.
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

    const removeInputPin = (nodeId, position) => {
      var ins = view.node[nodeId].ins

      if (no(ins)) view.node[nodeId].ins = ins = []

      if (no(position)) position = ins.length - 1

      view.node[nodeId].ins.splice(position, 1)
    }

    const removeOutputPin = (nodeId, position) => {
      var outs = view.node[nodeId].outs

      if (no(outs)) view.node[nodeId].outs = outs = []

      if (no(position)) position = outs.length - 1

      view.node[nodeId].outs.splice(position, 1)
    }

    const updateLink = (id, link) => {
      view.link[id] = Object.assign(view.link[id], link)
    }

    const component = (
      <Canvas
        addInputPin={addInputPin}
        addOutputPin={addOutputPin}
        createLink={createLink}
        createNode={createNode}
        deleteLink={deleteLink}
        deleteNode={deleteNode}
        dragItems={dragItems}
        item={item}
        removeInputPin={removeInputPin}
        removeOutputPin={removeOutputPin}
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
