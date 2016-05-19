var budo = require('budo')
var babelify = require('babelify')

budo('./src/dev/init.js', {
  live: true,
  stream: process.stdout,
  port: 8000,
  open: true,
  browserify: {
    transform: babelify
  }
})

