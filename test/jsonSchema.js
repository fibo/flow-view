const assert = require('assert')
const validator = require('is-my-json-valid')

const schema = require('../docs/schema.json')
const demoGraph = require('../examples/sample/graph.json')

const validate = validator(schema)

assert.ok(validate(demoGraph))
