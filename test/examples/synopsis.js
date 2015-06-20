
var fs     = require('fs'),
    jsdom  = require('jsdom'),
    should = require('should')

describe('examples/synopsis.html', function () {
  var context

  before(function (next) {
    var dist     = fs.readFileSync('./dist/flow-view.js', 'utf-8'),
        synopsis = fs.readFileSync('./gh-pages/js/synopsis.js', 'utf-8')

    jsdom.env({
      url: 'http://g14n.info/flow-view/examples/synopsis.html',
      scripts: [
        'http://g14n.info/flow-view/dist/flow-view.js'/*,
        'http://g14n.info/flow-view/js/synopsis.js'*/
      ],
      done: function (errors, window) {
              context = window
              if (errors) {
                console.log(errors)
                var err = new Error(errors[0].data.error)
                next(err)
              }
              else next()
            }
      })
    })

  it('works', function (next) {
    var document = context.document
//    console.log(context.require('flow-view'))
//    console.log(context.require('flow-view'))
//    console.log(document.getElementById('drawing').childNodes)
    next()
  })
})

