
var expect = chai.expect

describe("foo", function() {
  describe("bar", function() {
    it("is a test", function() {
      expect('foo').to.equal('foo')
    })
  })
})

