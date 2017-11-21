// @flow

const baseColor = 'gainsboro'

const defaultBorder = {
  width: 1,
  style: 'solid',
  color: baseColor
}

export const defaultTheme = {
  frame: {
    border: defaultBorder,
    color: {
      primary: '#A9DFBF',
      dark: '#52BE80'
    },
    font: {
      family: 'Courier',
      size: 17
    }
  },
  link: {
    color: 'darkgrey',
    width: 3
  },
  node: {
    body: {
      color: 'white',
      height: 20
    },
    color: baseColor,
    pin: {
      color: 'darkgrey',
      size: 10
    }
  },
  selector: { border: defaultBorder }
}
