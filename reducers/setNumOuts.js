const setNumOuts = (state, action) => {
  let node = Object.assign(
    {},
    state.node
  )

  const num = parseInt(action.num)
  const nodeid = action.nodeid

  const nodePins = Object.assign(
    [],
    node[nodeid].outs
  )

  const numPins = nodePins.length

  if (isNaN(num) || (numPins === num)) return state

  if (numPins < num) {
    // Adding pins.
    for (let i = numPins; i < num; i++) {
      node[nodeid].outs.push(`out${i}`)
    }
  } else {
    // Removing pins.
    for (let i = numPins; i > num; i--) {
      let isConnected = false

      // Look for links connected to this pin.
      Object.keys(state.link).forEach((linkid) => {
        if (isConnected) return

        const link = state.link[linkid]

        isConnected = ((link.from[0] === nodeid) && (link.from[1] === (i - 1)))
      })

      // Remove pin only if it is not connected.
      if (!isConnected) node[nodeid].outs.pop()
    }
  }

  return Object.assign({}, state, { node })
}

export default setNumOuts
