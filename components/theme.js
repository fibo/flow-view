'use strict'

var PropTypes = require('prop-types')

var defaultProps = {
  fontFamily: 'Courier',
  frameBorder: '1px solid #F0F4C3',
  darkPrimaryColor: '#AFB42B',
  primaryColor: '#CDDC39',
  lineWidth: 3,
  nodeBarColor: '#BDBDBD',
  nodeBodyHeight: 20,
  pinColor: '#757575',
  linkColor: '#9E9E9E',
  pinSize: 10
}

var propTypes = PropTypes.shape({
  fontFamily: PropTypes.string.isRequired,
  primaryColor: PropTypes.string.isRequired,
  lineWidth: PropTypes.number.isRequired,
  linkColor: PropTypes.string.isRequired,
  nodeBarColor: PropTypes.string.isRequired,
  nodeBodyHeight: PropTypes.number.isRequired,
  pinColor: PropTypes.string.isRequired,
  pinSize: PropTypes.number.isRequired
}).isRequired

module.exports = exports.default = {
  defaultProps: defaultProps,
  propTypes: propTypes
}
