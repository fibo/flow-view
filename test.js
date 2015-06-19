var fs     = require('fs'),
    jsdom  = require('jsdom'),
    should = require('should')

    // TODO see https://github.com/rstacruz/mocha-jsdom/blob/master/index.js
describe('my first browser test', function () {
    beforeEach(function (next) {
      var dist     = fs.readFileSync('./gh-pages/dist/flow-view.js', 'utf-8'),
          synopsis = fs.readFileSync('./gh-pages/js/synopsis.js', 'utf-8')

      var url     = 'http://g14n.info/flow-view/test/synopsis.html',
          scripts = [synopsis, dist]


      jsdom.env({
        url: 'http://g14n.info/flow-view/test/synopsis.html',
        scripts: [
          'http://g14n.info/flow-view/dist/flow-view.js',
          'http://g14n.info/flow-view/js/synopsis.js',
          'http://cdnjs.cloudflare.com/ajax/libs/chai/3.0.0/chai.js'
        ],
        done: function (errors, window) {
                //console.log(window.getElementById('drawing'))
                var err = new Error(errors[0].data.error)
                next(err)
              }
      })
    })

  it('works', function (next) {
    next()
  })
})

