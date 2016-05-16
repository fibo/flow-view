import no from 'not-defined'

const invalid = (data) => {
  throw new TypeError('Invalid data', data)
}

const Node = (data) => {
  if (no(data.ins)) invalid(data)
  if (no(data.outs)) invalid(data)
}

const Link = (data) => {
  if (no(data.from)) invalid(data)
  if (no(data.to)) invalid(data)
}

export default { Node, Link }
