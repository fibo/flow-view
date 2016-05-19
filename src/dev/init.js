import Canvas2 from 'flow-view'

const elementId = 'drawing'

let element = document.createElement('div')
element.id = elementId

document.body.appendChild(element)

const canvas = new Canvas2(elementId)
