const initialState = {
  height: 500,
  width: 500,
  node: {},
  link: {},
  selectedItems: [],
  isDraggingItems: false,
  previousDraggingPoint: null,
  // TODO hold ctrl or host key to enable multiple selection
  // by now svg element does not support keydown event,
  // I should open an issue on react repo or wrap the Canvas
  // component in a Root component that is a div with the keypress events
  multipleSelection: false
}

export default initialState
