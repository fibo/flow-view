// Primitive types.

export type Area = { height: number, width: number }

export type Id = string

export type Pin = mixed

export type Point = { x: number, y: number }

// Derived types.

export type NodeIdAndPosition = [Id, number]

export type SerializedLink = {
  from: NodeIdAndPosition,
  to: NodeIdAndPosition
}

export type SerializedNode = Point & Area & {
  ins?: Array<Pin>,
  outs?: Array<Pin>,
  text: string
}

export type CreatePin = (NodeIdAndPosition, Pin) => void
export type DeletePin = (NodeIdAndPosition) => void

export type CreateLink = (SerializedLink, Id) => void
export type DeleteLink = (Id) => void

export type CreateNode = (SerializedNode, Id) => void
export type DeleteNode = (Id) => void

// Secondly derived types

export type FlowView = {
  link: { [Id]: SerializedLink },
  node: { [Id]: SerializedNode }
}
