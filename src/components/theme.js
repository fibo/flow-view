import { PropTypes } from 'React'

const defaultProps = {
  fontFamily: 'Courier',
  frameBorder: '1px solid black',
  highlightColor: 'lightsteelblue',
  lineWidth: 3,
  nodeBarColor: 'lightgray',
  nodeBodyHeight: 20,
  pinColor: 'darkgray', // Ahahah darkgray is not darker than gray!
                        // Actually we have
                        // lightgray < darkgray < gray
  pinSize: 10
}

const propTypes = PropTypes.shape({
  fontFamily: PropTypes.string.isRequired,
  highlightColor: PropTypes.string.isRequired,
  lineWidth: PropTypes.number.isRequired,
  nodeBarColor: PropTypes.string.isRequired,
  nodeBodyHeight: PropTypes.number.isRequired,
  pinColor: PropTypes.string.isRequired,
  pinSize: PropTypes.number.isRequired,
}).isRequired

export default {
  defaultProps,
  propTypes
}
