const fvCssDefaultVarName= (name) => (`--fv-default-${name}`)
const fvCssVar= (name) => (`var(--fv-${name}, var(${fvCssDefaultVarName(name)}))`)

export const cssVar = {
  backgroundColor: fvCssVar('background-color'),
  boxShadow: fvCssVar('box-shadow'),
  connectionColor: fvCssVar('connection-color'),
  connectionColorHighlighted: fvCssVar('connection-color--highlighted'),
  fontFamily: fvCssVar('font-family'),
  fontSize: fvCssVar('font-size'),
  nodeBackgroundColor: fvCssVar('node-background-color'),
  textColor: fvCssVar('text-color')
};

export const cssDefault = {
  'background-color': '#fefefe',
  'connection-color': '#ccc',
  'box-shadow': "0px 0px 7px 1px rgba(0, 0, 0, 0.1)",
  'connection-color--highlighted': '#717171',
   'font-family': "sans-serif",
   'font-Size': "17px",
  'node-background-color': "#fefefe",
  'text-color': '#111'
}

export const cssTheme = Object.entries(cssDefault).reduce((theme,[key, value]) => ({...theme, [fvCssDefaultVarName(key)]: value}), {})
