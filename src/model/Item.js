import staticProps from 'static-props'

let nextId = 0

const generateId = () => {
  nextId++
  return `id${nextId}`
}

class FlowViewItem {
  constructor (id = generateId()) {
    staticProps(this)({ id })
  }

  getData () {
    const enumerableProps = Object.keys(this)

    let data = {}

    for (let prop of enumerableProps) {
      data[prop] = this[prop]
    }

    return data
  }
}

export default FlowViewItem
