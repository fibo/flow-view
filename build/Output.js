'use strict';

var inherits = require('inherits'),
    Pin = require('./Pin'),
    PreLink = require('./PreLink');

function Output(node, position) {
  Pin.call(this, 'outs', node, position);

  this.link = {};
}

inherits(Output, Pin);

function render() {
  // TODO for var i in view this.set(i, view[i])
  var self = this;

  var fill = this.fill,
      node = this.node,
      size = this.size,
      vertex = this.vertex.relative;

  var canvas = node.canvas;

  var rect = canvas.svg.rect(size, size).move(vertex.x, vertex.y).fill(fill);

  this.rect = rect;

  node.group.add(rect);

  var preLink = null;

  function mouseoverOutput() {
    preLink = new PreLink(canvas, self);
  }

  rect.on('mouseover', mouseoverOutput);
}

Output.prototype.render = render;

module.exports = Output;