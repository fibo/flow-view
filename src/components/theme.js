// @flow

import type { Color } from './types'

export const defaultTheme = {
  fontFamily: 'Courier',
  fontSize: 17,
  frameBorder: '1px solid #F0F4C3',
  darkPrimaryColor: '#52BE80',
  primaryColor: '#A9DFBF',
  lineWidth: 3,
  nodeBarColor: '#BDBDBD',
  nodeBodyColor: '#FFFFFF',
  nodeBodyHeight: 20,
  pinColor: '#757575',
  linkColor: '#9E9E9E',
  pinSize: 10
}

export type Theme = {
  darkPrimaryColor: Color,
  fontFamily: string,
  fontSize: number,
  primaryColor: Color,
  lineWidth: number,
  linkColor: Color,
  nodeBarColor: Color,
  nodeBodyHeight: number,
  pinColor: Color,
  pinSize: number
}
