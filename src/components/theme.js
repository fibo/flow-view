// @flow

import type {
  FrameTheme,
  Color,
  LinkTheme,
  NodeTheme,
  SelectorTheme
} from './types'

const baseColor = 'gainsboro'

const defaultBorder = {
  width: 1,
  style: 'solid',
  color: baseColor
}

export const defaultTheme = {
  fontFamily: 'Courier',
  fontSize: 17,
  frame: {
    border: defaultBorder
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
  darkPrimaryColor: '#52BE80',
  primaryColor: '#A9DFBF',
  link: {
    color: 'darkgrey',
    width: 3
  },
  selector: { border: defaultBorder }
}

export type Theme = {
  darkPrimaryColor: Color,
  fontFamily: string,
  fontSize: number,
  frame: FrameTheme,
  link: LinkTheme,
  node: NodeTheme,
  primaryColor: Color,
  selector: SelectorTheme
}
