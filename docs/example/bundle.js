(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Canvas = require('flow-view').Canvas

var view = require('./sample-view.json')

var canvas = new Canvas('drawing')

canvas.render(view)

},{"./sample-view.json":2,"flow-view":undefined}],2:[function(require,module,exports){
module.exports={
  "width": 720,
  "height": 250,
  "node": {
    "a": {
      "text": "your engine",
      "outs": ["out0", "out1"],
      "x": 270,
      "y": 10
    },
    "b": {
      "text": "flow-view",
      "ins": ["in"],
      "outs": ["out"],
      "x": 300,
      "y": 100
    },
    "c": {
      "text": "a cool app!",
      "ins": ["in0", "in1", "in2"],
      "outs": ["out"],
      "x": 300,
      "y": 170
    }
  },
  "link": {
    "l": {
      "from": ["a", 0],
      "to": ["b", 0]
    },
    "i": {
      "from": ["b", 0],
      "to": ["c", 0]
    }
  }
}

},{}]},{},[1]);
