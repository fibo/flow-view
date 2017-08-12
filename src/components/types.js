export type Area = { height: number, width: number }

export type IdAndPosition = [string, number]

export type Point = { x: number, y: number }

export type Node = Point & {
  ins: Array,
  outs: Array,
  text: string
}
