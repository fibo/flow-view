
var fs     = require('fs'),
    jsdom  = require('jsdom'),
    should = require('should')

describe('examples/synopsis.html', function () {
  before(function (next) {
    var dist     = fs.readFileSync('./dist/flow-view.js', 'utf-8'),
        synopsis = fs.readFileSync('./gh-pages/js/synopsis.js', 'utf-8')

    jsdom.env({
      url: 'http://g14n.info/flow-view/examples/synopsis.html',
      scripts: [
      /*
        dist,
        synopsis
        'http://g14n.info/flow-view/dist/flow-view.js',
        'http://g14n.info/flow-view/js/synopsis.js',
        */
      ],
      done: function (errors, window) {
                //console.log(window.getElementById('drawing'))
              if (errors) {
                console.log(errors)
                var err = new Error(errors[0].data.error)
                next(err)
              }
              else next()
                /*
                if (typeof errors === 'undefined') {
                  next()
                }
                else {
                }
                */
            }
      })
    })

  it('works', function (next) {
    next()
  })
})

