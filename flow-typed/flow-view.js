// @flow

// Primitive types.

declare type Area = { height: number, width: number }

declare type BorderStyle = string

declare type Color = string

declare type FontFamily = string

declare type NodeId = string
declare type LinkId = string

declare type Point = { x: number, y: number }

declare type Segment = { x1: number, y1: number, x2: number, y2: number }

// Derived types.

type BorderTheme = {
  width: number,
  style: BorderStyle,
  color: Color
}

declare type NodeIdAndPinPosition = {
  nodeId: NodeId,
  position: number
}

declare type Rectangle = Area & Point

declare type SemiLink = {
  from: NodeIdAndPinPosition,
  to?: NodeIdAndPinPosition
}

declare type SerializedLink = {
  from: NodeIdAndPinPosition,
  to: NodeIdAndPinPosition
}

declare type SerializedNode = Point & Area & {
  ins: ?Array<SerializedPin>,
  outs: ?Array<SerializedPin>,
  text: string
}

declare type SerializedPin = { name: string }

// Secondly derived types

declare type LinkCollection = { [LinkId]: SerializedLink }
declare type NodeCollection = { [NodeId]: SerializedNode }

declare type FrameTheme = {
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

declare type LinkTheme = {
  color: Color,
  width: number
}

declare type NodeTheme = {
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

declare type SelectorTheme = { border: BorderTheme }

declare type SerializedNodes = { [NodeId]: SerializedNode }

// Thirdly derived types.

declare type FlowView = {
  link: LinkCollection,
  node: NodeCollection,
  height?: number,
  width?: number
}

declare type Theme = {
  frame: FrameTheme,
  link: LinkTheme,
  node: NodeTheme,
  selector: SelectorTheme
}
