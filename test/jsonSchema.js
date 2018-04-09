const assert = require('assert')
const validator = require('is-my-json-valid')

const schema = require('../docs/schema.json')
const sampleView = require('../examples/render/sample-view.json')

const validate = validator(schema)

assert.ok(validate(sampleView))
