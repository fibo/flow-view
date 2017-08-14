/**
 * Compute x coordinate of a pin.
 *
 * @flow
 */
export default function xOfPin (
  pinSize: number,
  width: number,
  numPins: number,
  position: number
): number {
  if (position === 0) return 0

  if (numPins > 1) return position * (width - pinSize) / (numPins - 1)

  throw new Error('Could not compute x coordinate of pin')
}
