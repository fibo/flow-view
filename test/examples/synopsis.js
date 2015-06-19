
var jsdom  = require('jsdom'),
    should = require('should')

    // TODO see https://github.com/rstacruz/mocha-jsdom/blob/master/index.js
describe('my first browser test', function () {
    beforeEach(function (next) {
       console.log('before')
      jsdom.env({
        url: 'http://g14n.info/flow-view/examples/synopsis.html',
        scripts: [
          'http://g14n.info/flow-view/dist/flow-view.js',
          'http://g14n.info/flow-view/js/synopsis.js',
        ],
        done: function (errors, window) {
                console.log(errors)
                //console.log(window.getElementById('drawing'))
                var err = new Error(errors[0].data.error)
                next(err)
              }
      })
    })

  it('works', function (next) {
       console.log('test')
    next()
  })
})

