
function validate (view) {
  if (typeof view !== 'object')
    throw new TypeError()

  if (typeof view.node !== 'object')
    throw new TypeError()

  if (typeof view.link !== 'object')
    throw new TypeError()
}

module.exports = validate

