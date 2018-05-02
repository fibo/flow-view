(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const Canvas = require('flow-view').Canvas

const graph = {
  nodes: [
    {
      id: 'a',
      x: 80,
      y: 100,
      name: 'Drag me',
      outs: [
        { name: 'out1' },
        { name: 'out2' },
        { name: 'out3', type: 'boolean' }
      ]
    },
    {
      id: 'b',
      x: 180,
      y: 200,
      name: 'Click me',
      ins: [
        { name: 'in0' },
        { name: 'in1', type: 'boolean' }
      ],
      outs: [
        { name: 'return' }
      ]
    }
  ],
  links: [
    {
      id: 'c',
      from: ['a', 0],
      to: ['b', 0]
    }
  ]
}

const container = document.getElementById('drawing')

const canvas = new Canvas(container)

canvas.loadGraph(graph)

},{"flow-view":undefined}]},{},[1]);
