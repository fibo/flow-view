export const cssModifierHighlighted = (cssName) => (`${cssName}--highlighted`);

const fvCssDefaultVarName = (name) => (`--fv-default-${name}`);
const fvCssVar = (
  name,
) => (`var(--fv-${name}, var(${fvCssDefaultVarName(name)}))`);

export const cssVar = {
  backgroundColor: fvCssVar("background-color"),
  borderRadius: fvCssVar("border-radius"),
  boxShadow: fvCssVar("box-shadow"),
  connectionColor: fvCssVar("connection-color"),
  connectionColorHighlighted: fvCssVar(
    cssModifierHighlighted("connection-color"),
  ),
  fontFamily: fvCssVar("font-family"),
  fontSize: fvCssVar("font-size"),
  nodeBackgroundColor: fvCssVar("node-background-color"),
  nodeBorderColorHighlighted: fvCssVar(
    cssModifierHighlighted("node-border-color"),
  ),
  textColor: fvCssVar("text-color"),
};

const cssBase = {
  "border-radius": "2px",
  "font-family": "sans-serif",
  "font-Size": "17px",
};

export const cssDefault = {
  light: {
    ...cssBase,
    "background-color": "#fefefe",
    "connection-color": "#ccc",
    "box-shadow": "0px 0px 7px 1px rgba(0, 0, 0, 0.1)",
    [cssModifierHighlighted("connection-color")]: "#717171",
    "node-background-color": "#fefefe",
    [cssModifierHighlighted("node-border-color")]: "#717171",
    "text-color": "#111",
  },
  dark: {
    "background-color": "#121212",
    "connection-color": "#ccc",
    "box-shadow": "0px 0px 7px 1px rgba(0, 0, 0, 0.1)",
    [cssModifierHighlighted("connection-color")]: "#717171",
    "node-background-color": "#fefefe",
    "text-color": "#111",
  },
};

export const cssTheme = (colorScheme) =>
  Object.entries(cssDefault[colorScheme]).reduce(
    (theme, [key, value]) => ({ ...theme, [fvCssDefaultVarName(key)]: value }),
    {},
  );
