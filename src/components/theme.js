// @flow

import type {
  FrameTheme,
  Color,
  SelectorTheme
} from './types'

const nodeBarColor = 'gainsboro'

const defaultBorder = {
  width: 1,
  style: 'solid',
  color: nodeBarColor
}

export const defaultTheme = {
  fontFamily: 'Courier',
  fontSize: 17,
  frame: { border: defaultBorder },
  darkPrimaryColor: '#52BE80',
  primaryColor: '#A9DFBF',
  lineWidth: 3,
  nodeBarColor,
  nodeBodyColor: '#FFFFFF',
  nodeBodyHeight: 20,
  pinColor: '#757575',
  linkColor: '#9E9E9E',
  pinSize: 10,
  selector: { border: defaultBorder }
}

export type Theme = {
  darkPrimaryColor: Color,
  fontFamily: string,
  fontSize: number,
  frame: FrameTheme,
  primaryColor: Color,
  lineWidth: number,
  linkColor: Color,
  nodeBarColor: Color,
  nodeBodyHeight: number,
  pinColor: Color,
  pinSize: number,
  selector: SelectorTheme
}
