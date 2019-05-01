/* global CustomEvent HTMLDivElement */

const staticProps = require('static-props')

const localStored = require('./localStored')

const Creator = require('./Creator')
const Inspector = require('./Inspector')
const Root = require('./Root')

/**
 * A Canvas is the entry point to create a flow-view.
 */

class FlowViewCanvas {
  constructor (container) {
    if (!(container instanceof HTMLDivElement)) {
      container = document.createElement('div')

      document.body.appendChild(container)
    }

    // Theme.
    // =================================================================

    const theme = {
      frame: {
        fontFamily: '"Lucida Console", Monaco, monospace',
        fontSize: 14
      },
      inspector: {
        button: {
          color: 'darkgray',
          size: 12
        },
        baseColor: 'gainsboro'
      },
      link: {
        baseColor: 'darkgray',
        highlightColor: 'mediumaquamarine',
        width: 2
      },
      node: {
        backgroundColor: 'white',
        baseColor: 'gainsboro',
        highlightColor: '#A9DFBF'
      },
      pin: {
        baseColor: 'darkgray',
        highlightColor: 'mediumaquamarine',
        inspectedColor: 'mediumseagreen',
        size: 8
      },
      selection: {
        color: '#A9DFBF'
      }
    }

    let render = Function.prototype

    // Action dispatcher.
    // =================================================================

    function dispatch (canvas) {
      return function (action, args) {
        // Measure actions in development.
        if (process.env.NODE_ENV !== 'production') {
          console.time(action)
        }

        try {
          canvas[action](args)
        } catch (err) {
          console.error(`action ${action}`)
          throw err
        }

        // Invoking Root render() method will call all its sub components
        // render methods recursively.
        render(canvas.state)

        if (process.env.NODE_ENV !== 'production') {
          console.timeEnd(action)
        }
      }
    }

    const root = new Root(dispatch(this), container)
    render = root.render.bind(root)

    // State.
    // =================================================================

    const state = {
      boundingRect: root.boundingRect,
      creator: Object.assign({}, Creator.defaultState),
      currentPin: null,
      draggingItems: false,
      draggingLink: false,
      draggedLinkCoordinates: null,
      draggedLinkId: null,
      draggedLinkType: null,
      graph: { links: [], nodes: [] },
      inspector: Object.assign({},
        Inspector.defaultState,
        localStored('inspector').getItem()
      ),
      multiSelection: false,
      // Properties selected.links and selected.nodes are arrays,
      // their id unicity is handled by select* and deselect* methods.
      selected: { links: [], nodes: [] },
      theme
    }

    // Static props
    // =================================================================

    staticProps(this)({
      container,
      root,
      state
    })
  }

  blurPin () { this.state.currentPin = null }

  attachHalfLink ({ id, from, to }) {
    const linkIndex = this.state.graph.links.findIndex(link => link.id === id)

    if (linkIndex > -1) {
      if (from) {
        this.state.graph.links[linkIndex].from = from
      } else if (to) {
        this.state.graph.links[linkIndex].to = to
      }

      this.state.draggingLink = null
      this.state.draggedLinkCoordinates = null
      this.state.draggedLinkId = null
      this.state.draggedLinkType = null
    }
  }

  createHalfLink (halfLink) {
    const id = this.generateId()

    this.state.draggingLink = true
    this.state.draggedLinkCoordinates = halfLink.cursorCoordinates
    this.state.draggedLinkId = id
    this.state.draggedLinkType = halfLink.type

    this.state.graph.links.push({
      id,
      from: halfLink.from,
      to: halfLink.to
    })

    this.resetSelection()
  }

  createLink (link) {
    link.id = this.generateId()
    this.state.graph.links.push(link)
  }

  createNode (node) {
    node.id = this.generateId()
    console.log(node)

    this.state.graph.nodes.push(node)

    this.hideCreator()
  }

  createPin ({ nodeId, type, position, pin }) {
    const { nodes } = this.state.graph

    const pins = `${type}s`

    const nodeIndex = nodes.findIndex(node => node.id === nodeId)

    // Properties ins and outs could be not defined, they are not
    // required in flow-view JSON Schema.
    if (typeof nodes[nodeIndex][pins] === 'undefined') {
      nodes[nodeIndex][pins] = []
    }

    nodes[nodeIndex][pins].splice(position, 0, pin)
  }

  deleteHalfLink () {
    const draggedLinkId = this.state.draggedLinkId

    this.state.draggingLink = null
    this.state.draggedLinkCoordinates = null
    this.state.draggedLinkId = null
    this.state.draggedLinkType = null

    const draggedLinkIndex = this.state.graph.links.findIndex(({ id }) => id === draggedLinkId)

    this.state.graph.links.splice(draggedLinkIndex, 1)
  }

  deleteLink (linkId) {
    const { links } = this.state.graph

    // Find link by id and remove it.
    const linkIndex = links.findIndex(({ id }) => id === linkId)
    links.splice(linkIndex, 1)
  }

  deleteNode (nodeId) {
    const { links, nodes } = this.state.graph

    // Find node by id and remove it.
    const nodeIndex = nodes.findIndex(({ id }) => id === nodeId)
    nodes.splice(nodeIndex, 1)

    // Remove orphan links.
    const orphanLinkIds = links.reduce((ids, link) => {
      const { from, to } = link

      if ((from && from[0] === nodeId) || (to && to[0] === nodeId)) {
        return ids.concat(link.id)
      } else {
        return ids
      }
    }, [])

    orphanLinkIds.forEach(id => this.deleteLink(id))
  }

  // TODO detachLink

  deletePin ({ type, nodeId, position }) {
    const { links, nodes } = this.state.graph

    const pins = `${type}s`

    const nodeIndex = nodes.findIndex(node => node.id === nodeId)

    // Remove pin.
    nodes[nodeIndex][pins].splice(position, 1)

    // Remove orphan links.
    const orphanLinkIds = links.reduce((ids, link) => {
      const { from, to } = link

      if ((from && from[0] === nodeId && from[1] === position) || (to && to[0] === nodeId && to[1] === position)) {
        return ids.concat(link.id)
      } else {
        return ids
      }
    }, [])

    orphanLinkIds.forEach(id => this.deleteLink(id))
  }

  deleteSelection () {
    const { links, nodes } = this.state.selected

    // Remove links first; deleting a node will remove orphan links.
    links.forEach(id => this.deleteLink(id))
    nodes.forEach(id => this.deleteNode(id))

    this.resetSelection()
  }

  deselectNode (id) {
    const index = this.state.selected.nodes.indexOf(id)

    if (index > -1) {
      this.state.selected.nodes.splice(index, 1)
    }

    this.hideCreator()
  }

  disableMultiSelection () { this.state.multiSelection = false }

  dragItems ({ x, y }) {
    const {
      graph,
      selected
    } = this.state

    graph.nodes
      .filter(({ id }) => (selected.nodes.indexOf(id) > -1))
      .forEach(node => {
        node.x += x
        node.y += y
      })
  }

  dragLink (cursorCoordinates) {
    this.state.draggedLinkCoordinates = cursorCoordinates
  }

  emit (eventType, eventDetail) {
    const event = new CustomEvent(eventType, { detail: eventDetail })

    this.container.dispatchEvent(event)
  }

  enableMultiSelection () { this.state.multiSelection = true }

  focusPin (currentPin) { this.state.currentPin = currentPin }

  // TODO implement next-string

  generateId () {
    let result = ''

    while (result.length < 3) {
      result += String.fromCharCode(97 + Math.floor(Math.random() * 26))
    }

    return result
  }

  hideCreator () { this.state.creator.hidden = true }

  hideInspector () {
    this.state.inspector.hidden = true

    localStored('inspector').assign({ hidden: true })
  }

  loadGraph (graph) {
    this.state.graph = graph

    this.root.render(this.state)
  }

  on (eventType, eventListener) {
    this.container.addEventListener(eventType, event => eventListener(event.detail))
  }

  pinInspector () {
    this.state.inspector.pinned = true

    localStored('inspector').assign({ pinned: true })
  }

  renameNode ({ id, name }) {
    const { nodes } = this.state.graph

    const nodeIndex = nodes.findIndex(node => node.id === id)

    nodes[nodeIndex].name = name
  }

  renamePin ({ type, nodeId, position, name }) {
    const { nodes } = this.state.graph

    const nodeIndex = nodes.findIndex(node => node.id === nodeId)

    this.state.graph.nodes[nodeIndex][`${type}s`][position].name = name
  }

  resize (boundingRect) { this.state.boundingRect = boundingRect }

  selectLink (id) {
    const {
      graph,
      multiSelection,
      selected
    } = Object.assign({}, this.state)

    const notSelected = selected.links.indexOf(id) === -1

    if (notSelected) {
      if (multiSelection) {
        selected.links.push(id)
      } else {
        this.resetSelection()
        selected.links = [id]
      }
    }

    this.state.graph.links = graph.links
    this.state.selected.links = selected.links

    this.hideCreator()
  }

  selectNode (id) {
    const {
      graph,
      multiSelection,
      selected
    } = Object.assign({}, this.state)

    const notSelected = selected.nodes.indexOf(id) === -1

    if (notSelected) {
      if (multiSelection) {
        selected.nodes.push(id)
      } else {
        this.resetSelection()
        selected.nodes = [id]
      }
    }

    this.state.graph.nodes = graph.nodes
    this.state.selected.nodes = selected.nodes

    this.hideCreator()
  }

  resetSelection () {
    this.state.selected = { links: [], nodes: [] }

    this.hideCreator()
    this.stopDraggingItems()
  }

  showCreator ({ x, y }) { this.state.creator = { hidden: false, x, y } }

  showInspector () {
    this.state.inspector.hidden = false

    localStored('inspector').assign({ hidden: false })
  }

  startDraggingItems () { this.state.draggingItems = true }

  stopDraggingItems () { this.state.draggingItems = false }

  unpinInspector () {
    this.state.inspector.pinned = false

    localStored('inspector').assign({ pinned: false })
  }
}

module.exports = exports.default = FlowViewCanvas
