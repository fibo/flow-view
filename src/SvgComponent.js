const staticProps = require('static-props')

const Component = require('./Component')

/**
 * Component base class for SVG elements.
 */

class FlowViewSvgComponent extends Component {
  constructor (canvas, dispatch, container) {
    super(canvas, dispatch, container)

    staticProps(this)({
      namespaceURI: 'http://www.w3.org/2000/svg'
    })
  }

  createElementNS (qualifiedName, container) {
    const element = document.createElementNS(this.namespaceURI, qualifiedName)

    if (container) {
      container.appendChild(element)
    } else {
      this.container.appendChild(element)
    }

    return element
  }
}

module.exports = FlowViewSvgComponent
