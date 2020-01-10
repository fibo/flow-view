const assert = require('assert')
const validator = require('is-my-json-valid')

const schema = require('../docs/schema.json')

const graph1 = require('../docs/examples/basic/graph.json')
const graph2 = require('./graph.json')

const validate = validator(schema)

assert.ok(validate(graph1))
assert.ok(validate(graph2))
