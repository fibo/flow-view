const xCenterOfPin = (pinRadius, width, numPins, position) => {
  if (position === 0) return pinRadius

  if (numPins > 1) return position * (width - pinRadius) / (numPins - 1)
}

export default xCenterOfPin
