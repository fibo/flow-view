
// Consider this module will be browserified.
//
// Load svg.js first ...
var SVG = require('svg.js')

// ... then load plugins: since plugins do not use *module.exports*, they are
// loaded as plain text, and when browserified they will be included in the bundle.
require('svg.draggable.js')

module.exports = SVG

