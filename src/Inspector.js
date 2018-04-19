const bindme = require('bindme')
const staticProps = require('static-props')

const Component = require('./Component')

/**
 * The Inspector let user modify Node properties.
 */

class FlowViewInspector extends Component {
  constructor (canvas, dispatch, container) {
    super(canvas, dispatch, container)

    // Start hidden.
    container.style.display = 'none'

    // DOM Elements.
    // =================================================================

    const pin = this.createElement('botton')
    pin.style.cursor = 'default'

    const nodeName = this.createElement('span')

    const inputList = this.createElement('ul')

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
      nodeName,
      pin,
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
      nodeName,
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

    const colorChanged = this.baseColor !== baseColor
    const pinnedChanged = this.pinned !== pinned
    const visibilityChanged = pinned ? false : this.hidden !== hidden
    const widthChanged = this.width !== width

    // Visibility (first).
    //= =================================================================

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
    //= =================================================================

    if (pinnedChanged) {
      this.pinned = pinned

      if (pinned) {
        pin.innerHTML = '❌'
      } else {
        pin.innerHTML = '📌'
      }
    }

    // Colors.
    //= =================================================================

    if (colorChanged) {
      this.baseColor = baseColor
      container.style.border = `1px solid ${baseColor}`
    }

    // Width.
    //= =================================================================

    if (widthChanged) { container.style.width = `${width}px` }

    // Inspect node.
    //= =================================================================

    if (selectedNodes.length === 0) {
      nodeName.innerHTML = `(${graph.nodes.length} nodes)`
    }

    if (selectedNodes.length === 1) {
      nodeName.innerHTML = selectedNodes[0].name
    }

    if (selectedNodes.length > 1) {
      nodeName.innerHTML = `(${selectedNodes.length} nodes)`
    }
  }
}

// Static attributes.
//= ====================================================================

const defaultState = {
  hidden: true,
  pinned: false,
  width: 170
}

staticProps(FlowViewInspector)({ defaultState })

module.exports = FlowViewInspector
