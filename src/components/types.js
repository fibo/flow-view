// @flow

// Primitive types.

export type Area = { height: number, width: number }

export type Color = string

export type Id = string

export type SerializedPin = string | { name: string }

export type Point = { x: number, y: number }

export type Segment = { x1: number, y1: number, x2: number, y2: number }

// Derived types.

export type Rectangle = Area & Point

export type NodeIdAndPosition = [Id, number]

export type ConnectLinkToTarget = (Id, NodeIdAndPosition) => void

export type SemiLink = {
  from: NodeIdAndPosition,
  to: ?NodeIdAndPosition
}

export type SerializedLink = {
  from: NodeIdAndPosition,
  to: NodeIdAndPosition
}

export type SerializedNode = Point & Area & {
  ins: ?Array<SerializedPin>,
  outs: ?Array<SerializedPin>,
  text: string
}

export type CreatePin = (NodeIdAndPosition, SerializedPin) => void
export type DeletePin = (NodeIdAndPosition) => void

export type CreateLink = (SemiLink, Id) => void
export type DeleteLink = (Id) => void

export type CreateNode = (SerializedNode, Id) => void
export type DeleteNode = (Id) => void

// Secondly derived types

export type LinkCollection = { [Id]: SerializedLink }
export type NodeCollection = { [Id]: SerializedNode }

export type FlowView = {
  link: LinkCollection,
  node: NodeCollection
}
