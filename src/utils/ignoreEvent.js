// @flow

export default function ignoreEvent (event: Event): void {
  event.preventDefault()
  event.stopPropagation()
}
