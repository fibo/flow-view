test('JSON schema', () => {
  const validator = require('is-my-json-valid')

  const schema = require('../docs/schema.json')
  const sampleView = require('../examples/render/sample-view.json')

  const validate = validator(schema)

  expect(validate(sampleView)).toBeTruthy()
})
