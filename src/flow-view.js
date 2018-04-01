const EventEmitter = require('events')
const staticProps = require('static-props')

const Creator = require('./Creator')
const Inspector = require('./Inspector')
const Root = require('./Root')

// TODO emit events: createItems, deleteItems, updateItems

/**
 * A Canvas is the entry point to create a flow-view.
 */

class FlowViewCanvas extends EventEmitter {
  constructor (container, graph) {
    super()

    // Theme.
    // =================================================================

    // TODO use merge-props to implement custom themes
    this.theme = {
      frame: {
        fontFamily: 'Courier',
        fontSize: 14
      },
      inspector: {
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

    // State.
    // =================================================================

    this.state = {
      creator: Object.assign({}, Creator.defaultState),
      currentPin: null,
      dragging: false,
      graph: { links: [], nodes: [] },
      inspector: Object.assign({}, Inspector.defaultState),
      multiSelection: false,
      // Properties selected.links and selected.nodes are arrays,
      // their id unicity is handled by select* and deselect* methods.
      selected: { links: [], nodes: [] }
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

        // Invoking Root render will call all its sub components
        // render methods recursively.
        render(canvas.state)

        if (process.env.NODE_ENV !== 'production') {
          console.timeEnd(action)
        }
      }
    }

    const root = new Root(this, dispatch(this), container)
    this.state.root = root.boundingRect
    render = root.render.bind(root)

    dispatch(this)('loadGraph', graph)

    // Static props.
    // =================================================================

    staticProps(this)({ root })
  }

  blurPin () { this.state.currentPin = null }

  createLink () {}
  createInputPin () {}

  createNode (node) {
    node.id = this.generateId()

    this.state.graph.nodes.push(node)

    this.hideCreator()
  }

  createOutputPin () {

  }

  deleteInputPin () {

  }

  deleteOutputPin () {

  }

  deleteView () {

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
    const { selected, graph } = this.state

    graph.nodes
      .filter(({ id }) => (selected.nodes.indexOf(id) > -1))
      .forEach(node => {
        node.x += x
        node.y += y
      })
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

  hideInspector () { this.state.inspector.hidden = true }

  loadGraph (graph) {
    this.state.graph = graph
    this.emit('loadGraph', graph)
  }

  pinInspector () { this.state.inspector.pinned = true }

  resize (boundingRect) { this.state.root = boundingRect }

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
        selected.nodes = [id]
      }
    }

    this.state.graph.nodes = graph.nodes
    this.state.selected.nodes = selected.nodes

    this.hideCreator()
  }

  resetSelection () {
    this.state.selected = { links: [], nodes: [] }

    this.stopDragging()
  }

  showCreator ({ x, y }) { this.state.creator = { hidden: false, x, y } }

  showInspector () { this.state.inspector.hidden = false }

  startDragging () { this.state.dragging = true }

  stopDragging () { this.state.dragging = false }

  unpinInspector () { this.state.inspector.pinned = false }
}

module.exports = { Canvas: FlowViewCanvas }
