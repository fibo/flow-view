'use strict'

var _react = require('react')

var _react2 = _interopRequireDefault(_react)

var _Node = require('./Node')

var _Node2 = _interopRequireDefault(_Node)

var _reactTestRenderer = require('react-test-renderer')

var _reactTestRenderer2 = _interopRequireDefault(_reactTestRenderer)

function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { default: obj } }

it('renders correctly', function () {
  var tree = _reactTestRenderer2.default.create(_react2.default.createElement(_Node2.default, { fontSize: 12, x: 0, y: 0 })).toJSON()
  expect(tree).toMatchSnapshot()
})
