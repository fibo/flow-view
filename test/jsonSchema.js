const assert = require('assert')
const validator = require('is-my-json-valid')

const schema = require('../schema.json')

const graph1 = require('./graph1.json')
const graph2 = require('./graph2.json')

const validate = validator(schema)

assert.ok(validate(graph1))
assert.ok(validate(graph2))
