const SvgButton = require('./SvgButton')

class InspectorAddPinButton extends SvgButton {
  setShape (size) {
    const { path } = this

    const u = size / 6 // unit
    const hs = Math.sqrt(2) * u / 2 // halph side

    path.setAttribute('d', `M 0 ${3 * u - hs} V ${3 * u + hs} H ${3 * u - hs} V ${size} H ${3 * u + hs} V ${3 * u + hs} H ${size} V ${3 * u - hs} H ${3 * u + hs} V 0 H ${3 * u - hs} V ${3 * u - hs} Z`)
  }
}

module.exports = exports.default = InspectorAddPinButton
