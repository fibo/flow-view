
// Consider this module will be browserified.

// Load svg.js first ...
var SVG = require('svg.js')

// ... then load plugins: since plugins do not use *module.module.exports = they are
// loaded as plain text, and when browserified they will be included in the bundle.
require('svg.draggable.js')
require('svg.foreignobject.js')

// Note that, in order to be included as expected by browserify, dynamic imports
// do not work: for instance a code like the following won't work client-side
//
//    ['svg.draggable.js', 'svg.foreignobject.js'].forEach(require)
//

module.exports = SVG

