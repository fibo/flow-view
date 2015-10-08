
var defaultView = require('../src/default/view.json'),
    validate    = require('../src/validate')

var should = require('should')

describe('default view', function () {
  it('is valid', function () {
    should.doesNotThrow(function () {
      validate(defaultView)
    })
  })
})

