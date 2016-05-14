import staticProps from 'static-props'

const enumerable = true

function enumerableProps (obj, props) {
  staticProps(obj)(props, enumerable)
}

export default enumerableProps
