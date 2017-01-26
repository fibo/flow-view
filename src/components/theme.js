import { PropTypes } from 'react'

/*

Palette from https://www.materialpalette.com/lime/grey

Thanks to Tania and Lucilla.

dark primary color #AFB42B
primary color #CDDC39
light primary color #F0F4C3

accent color #9E9E9E
primary text #212121
secondary text #757575

text / icons #212121
divider color #BDBDBD
*/

const defaultProps = {
  fontFamily: 'Courier',
  frameBorder: '1px solid #F0F4C3',
  highlightColor: '#CDDC39',
  lineWidth: 3,
  linkColor: '#757575',
  nodeBarColor: '#BDBDBD',
  nodeBodyHeight: 20,
  pinColor: '#9E9E9E',
  pinSize: 10
}

const propTypes = PropTypes.shape({
  fontFamily: PropTypes.string.isRequired,
  highlightColor: PropTypes.string.isRequired,
  lineWidth: PropTypes.number.isRequired,
  linkColor: PropTypes.string.isRequired,
  nodeBarColor: PropTypes.string.isRequired,
  nodeBodyHeight: PropTypes.number.isRequired,
  pinColor: PropTypes.string.isRequired,
  pinSize: PropTypes.number.isRequired
}).isRequired

export default {
  defaultProps,
  propTypes
}
