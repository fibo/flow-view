
/**
 * @api private
 */

function validate (view) {
  if (typeof view !== 'object')
    throw new TypeError('view is not an object')

  if (typeof view.node !== 'object')
    throw new TypeError('node is not an object')

  if (typeof view.link !== 'object')
    throw new TypeError('link is not an object')
}

module.exports = validate

