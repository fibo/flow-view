import no from 'not-defined'

const invalid = (data) => {
  throw new TypeError('Invalid data', data)
}

const Node = (data) => {
  const requiredProps = ['ins', 'outs', 'x', 'y', 'w', 'h']

  requiredProps.forEach((prop) => {
    if (no(data[prop])) invalid(data)
  })
}

const Link = (data) => {
  if (no(data.from)) invalid(data)
  if (no(data.to)) invalid(data)
}

export default { Node, Link }
