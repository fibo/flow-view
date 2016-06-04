const ignoreEvent = (e) => {
  e.preventDefault()
  e.stopPropagation()
}

export default ignoreEvent
