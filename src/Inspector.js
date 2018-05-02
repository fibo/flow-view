const bindme = require('bindme')
const staticProps = require('static-props')

const Component = require('./Component')

const EditableText = require('./EditableText')
const InspectorPinList = require('./InspectorPinList')

/**
 * The Inspector let user modify Node properties.
 */

class FlowViewInspector extends Component {
  constructor (canvas, dispatch, container) {
    super(canvas, dispatch, container)

    // DOM Elements.
    // =================================================================

    const pin = this.createElement('botton')
    pin.style.cursor = 'default'

    const labelContainer = this.createElement('div')
    const label = new EditableText(canvas, dispatch, labelContainer)

    const inputListContainer = this.createElement('div')
    const inputList = new InspectorPinList(canvas, dispatch, inputListContainer, 'in')

    const outputListContainer = this.createElement('div')
    const outputList = new InspectorPinList(canvas, dispatch, outputListContainer, 'out')

    // Event bindings.
    // =================================================================

    bindme(this,
      'onClickPin',
      'onMouseLeave'
    )

    container.addEventListener('mouseleave', this.onMouseLeave)
    pin.addEventListener('click', this.onClickPin)

    // Static attributes.
    // =================================================================

    staticProps(this)({
      inputList,
      outputList,
      label,
      pin
    })
  }

  onClickPin () {
    const action = this.pinned ? 'unpinInspector' : 'pinInspector'

    this.dispatch(action)
  }

  onMouseLeave () { if (!this.pinned) this.dispatch('hideInspector') }

  render (state) {
    const {
      canvas,
      container,
      dispatch,
      inputList,
      label,
      outputList,
      pin
    } = this

    const {
      graph,
      inspector,
      selected
    } = state

    const {
      hidden,
      pinned,
      width
    } = inspector

    const { baseColor } = canvas.theme.inspector

    const selectedNodes = graph.nodes.filter(({ id }) => selected.nodes.indexOf(id) > -1)
    const numSelectedNodes = selectedNodes.length

    const colorChanged = this.baseColor !== baseColor
    const pinnedChanged = this.pinned !== pinned
    const visibilityChanged = pinned ? false : this.hidden !== hidden
    const widthChanged = this.width !== width

    // Visibility (first).
    // =================================================================

    if (visibilityChanged) {
      this.hidden = hidden

      if (hidden) {
        container.style.display = 'none'
      } else {
        container.style.display = ''
      }
    }

    // Nothing to render if component is hidden.
    if (hidden) return

    // Pin.
    // =================================================================

    if (pinnedChanged) {
      this.pinned = pinned

      if (pinned) {
        pin.innerHTML = '❌'
      } else {
        pin.innerHTML = '📌'
      }
    }

    // Colors.
    // =================================================================

    if (colorChanged) {
      this.baseColor = baseColor
      container.style.border = `1px solid ${baseColor}`
    }

    // Width.
    // =================================================================

    if (widthChanged) {
      this.width = width
      container.style.width = `${width}px`
    }

    // Inspect node.
    // =================================================================

    if (numSelectedNodes === 1) {
      const node = selectedNodes[0]

      label.action = (name) => {
        dispatch('renameNode', { id: node.id, name })
      }

      label.render({
        editable: true,
        text: node.name
      })

      inputList.show()
      const ins = node.ins || []
      inputList.render({
        nodeId: node.id,
        pins: ins
      })

      outputList.show()
      const outs = node.outs || []
      outputList.render({
        nodeId: node.id,
        pins: outs
      })
    } else {
      delete label.action

      inputList.hide()
      inputList.render({ pins: [] })

      outputList.hide()
      outputList.render({ pins: [] })

      if (numSelectedNodes === 0) {
        label.render({
          editable: false,
          text: `(${graph.nodes.length} nodes)`
        })
      }

      if (numSelectedNodes > 1) {
        label.render({
          editable: false,
          text: `(${numSelectedNodes} nodes)`
        })
      }
    }
  }
}

// Static attributes.
// ====================================================================

const defaultState = {
  hidden: true,
  pinned: false,
  width: 170
}

staticProps(FlowViewInspector)({ defaultState })

module.exports = FlowViewInspector
