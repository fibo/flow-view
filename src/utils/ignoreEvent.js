function ignoreEvent (e) {
  e.preventDefault()
  e.stopPropagation()
}

module.exports = exports.default = ignoreEvent
