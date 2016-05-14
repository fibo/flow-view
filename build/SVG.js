'use strict';

// This src/SVG.js file is an arranged SVG to enable server side run.
// See src/window.SVG.js for the client (a.k.a. browserifyed) version.

var jsdom = require('jsdom').jsdom;

var document = jsdom('<div id="drawing"></div>');

var window = document.defaultView;

module.exports = require('svg.js')(window);