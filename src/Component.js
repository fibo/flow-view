const bindme = require('bindme')
const pdsp = require('pdsp')
const staticProps = require('static-props')

/**
 * Component base class for any DOM element.
 */

class FlowViewComponent {
  constructor (canvas, dispatch, container) {
    staticProps(this)({
      canvas,
      component: {},
      container,
      dispatch: () => dispatch
    })

    // Event bindings.
    //= =================================================================

    bindme(this, 'dropEvent')
  }

  createElement (qualifiedName, container) {
    const element = document.createElement(qualifiedName)

    if (container) {
      container.appendChild(element)
    } else {
      this.container.appendChild(element)
    }

    return element
  }

  dropEvent (event) { pdsp(event) }

  hide () { this.container.style.display = 'none' }

  render (state) {
    this.renderAllSubComponents(state)
  }

  renderAllSubComponents (state) {
    const component = this.component

    Object.getOwnPropertyNames(component).forEach(function (key) {
      component[key].render(state)
    })
  }

  show () { this.container.style.display = '' }
}

module.exports = FlowViewComponent
