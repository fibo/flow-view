/* global localStorage */

function localStored (itemName) {
  const getItem = () => {
    const value = localStorage.getItem(itemName)

    return value ? JSON.parse(value) : value
  }

  const assign = (prop) => {
    const item = getItem()

    if (item) {
      localStorage.setItem(itemName, JSON.stringify(Object.assign(item, prop)))
    } else {
      localStorage.setItem(itemName, JSON.stringify(prop))
    }
  }

  return { assign, getItem }
}

module.exports = exports.default = localStored
