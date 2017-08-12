/*
 * Palette from https://www.materialpalette.com/lime/grey
 *
 * Thanks to Tania and Lucilla.
 *
 * dark primary color #AFB42B
 * primary color #CDDC39
 * light primary color #F0F4C3
 *
 * accent color #9E9E9E
 * primary text #212121
 * secondary text #757575
 *
 * text / icons #212121
 * divider color #BDBDBD
 */

export const defaultTheme = {
  fontFamily: 'Courier',
  fontSize: 17,
  frameBorder: '1px solid #F0F4C3',
  darkPrimaryColor: '#AFB42B',
  primaryColor: '#CDDC39',
  lineWidth: 3,
  nodeBarColor: '#BDBDBD',
  nodeBodyHeight: 20,
  pinColor: '#757575',
  linkColor: '#9E9E9E',
  pinSize: 10
}

export type Theme = {
  fontFamily: string,
  fontSize: number,
  primaryColor: string,
  lineWidth: number,
  linkColor: string,
  nodeBarColor: string,
  nodeBodyHeight: number,
  pinColor: string,
  pinSize: number
}
