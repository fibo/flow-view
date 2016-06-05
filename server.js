var budo = require('budo')
var babelify = require('babelify')

budo('./src/examples/basic/usage.js', {
  live: true,
  stream: process.stdout,
  port: 8000,
  open: true,
  browserify: {
    transform: babelify
  }
})

