// @flow

// Primitive types.

export type Area = { height: number, width: number }

export type BorderStyle = string

export type Color = string

export type FontFamily = string

export type NodeId = string
export type LinkId = string

export type Point = { x: number, y: number }

export type Segment = { x1: number, y1: number, x2: number, y2: number }

// Derived types.

type BorderTheme = {
  width: number,
  style: BorderStyle,
  color: Color
}

export type NodeIdAndPinPosition = {
  nodeId: Id,
  position: number
}

export type Rectangle = Area & Point

export type SemiLink = {
  from: NodeIdAndPinPosition,
  to: ?NodeIdAndPinPosition
}

export type SerializedLink = {
  from: NodeIdAndPinPosition,
  to: NodeIdAndPinPosition
}

export type SerializedNode = Point & Area & {
  ins: ?Array<SerializedPin>,
  outs: ?Array<SerializedPin>,
  text: string
}

export type SerializedPin = { name: string }

export type CreatePin = (NodeIdAndPinPosition, SerializedPin) => void
export type DeletePin = (NodeIdAndPinPosition) => void

export type CreateLink = (SemiLink, ?LinkId) => void
export type DeleteLink = (LinkId) => void

export type CreateNode = (SerializedNode, NodeId) => void
export type DeleteNode = (NodeId) => void

export type UpdateNodesGeometry = (Array<SerializedNode>) => void

// Secondly derived types

export type ConnectLinkToTarget = (Id, NodeIdAndPinPosition) => void

export type LinkCollection = { [Id]: SerializedLink }
export type NodeCollection = { [Id]: SerializedNode }

export type FrameTheme = {
  border: BorderTheme,
  color: {
    background: Color,
    highlight: Color,
    primary: Color
  },
  font: {
    family: FontFamily,
    size: number
  }
}

export type LinkTheme = {
  color: Color,
  width: number
}

export type NodeTheme = {
  body: {
    color: Color,
    height: number
  },
  color: Color,
  pin: {
    color: Color,
    size: number
  }
}

export type SelectorTheme = { border: BorderTheme }

export type SerializedNodes = { [Id]: SerializedNode }

// Thirdly derived types.

export type FlowView = {
  link: LinkCollection,
  node: NodeCollection,
  height?: number,
  width?: number
}

export type Theme = {
  frame: FrameTheme,
  link: LinkTheme,
  node: NodeTheme,
  selector: SelectorTheme
}
